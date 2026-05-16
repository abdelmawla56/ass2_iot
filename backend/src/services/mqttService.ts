import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
import riskEngine from './riskEngine';
import securityService from './securityService';

const prisma = new PrismaClient();
const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

class MQTTService {
  private client: mqtt.MqttClient | null = null;

  init() {
    this.client = mqtt.connect(BROKER_URL);

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      this.client?.subscribe(['iot/telemetry', 'iot/ota/status']);
    });

    this.client.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());

        if (topic === 'iot/telemetry') {
          await this.handleTelemetry(payload);
        } else if (topic === 'iot/ota/status') {
          await this.handleOTAStatus(payload);
        }
      } catch (error) {
        console.error('Error handling MQTT message:', error);
      }
    });
  }

  private async handleTelemetry(data: any) {
    const { deviceId, temperature, humidity, leafWetness, rainfall, timestamp } = data;

    // Find or create device
    let device = await prisma.device.findUnique({
      where: { deviceId }
    });

    if (!device) {
      // Auto-register device for simulation purposes if it doesn't exist
      // In a real app, you'd pre-register devices
      const zone = await prisma.zone.findFirst();
      if (zone) {
        device = await prisma.device.create({
          data: {
            deviceId,
            name: `Sensor ${deviceId}`,
            zoneId: zone.id,
            status: 'ONLINE'
          }
        });
      } else {
        console.warn('No zones found. Cannot register device.');
        return;
      }
    }

    // Save telemetry
    await prisma.telemetry.create({
      data: {
        deviceId: device.id,
        temperature,
        humidity,
        leafWetness,
        rainfall,
        timestamp: new Date(timestamp)
      }
    });

    // Update device status and lastSeen
    await prisma.device.update({
      where: { id: device.id },
      data: { status: 'ONLINE', lastSeen: new Date() }
    });

    // Run Risk Engine
    await riskEngine.process(device.id, device.zoneId, {
      temperature,
      humidity,
      leafWetness,
      rainfall
    });

    // Security Monitoring
    await securityService.analyzeTelemetry(device.id, data);
  }

  private async handleOTAStatus(data: any) {
    const { deviceId, version, status, progress } = data;

    const device = await prisma.device.findUnique({
      where: { deviceId }
    });

    if (device) {
      await prisma.oTAUpdate.create({
        data: {
          deviceId: device.id,
          version,
          status,
          progress
        }
      });

      if (status === 'UPDATED') {
        await prisma.device.update({
          where: { id: device.id },
          data: { firmwareVersion: version, status: 'ONLINE' }
        });
      } else if (status === 'FAILED') {
        await prisma.device.update({
          where: { id: device.id },
          data: { status: 'ONLINE' }
        });
        // Check for rollback logic
        await this.checkRollback(version);
      } else {
        await prisma.device.update({
          where: { id: device.id },
          data: { status: 'UPDATING' }
        });
      }
    }
  }

  private async checkRollback(version: string) {
    const failedUpdates = await prisma.oTAUpdate.count({
      where: {
        version,
        status: 'FAILED',
        timestamp: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // last 10 mins
        }
      }
    });

    if (failedUpdates >= 2) {
      console.log(`Rollback triggered for version ${version} due to ${failedUpdates} failures.`);
      await prisma.securityLog.create({
        data: {
          eventType: 'OTA_ROLLBACK',
          description: `Automatic rollback triggered for version ${version}. Multiple device failures detected.`,
          severity: 'CRITICAL'
        }
      });
      // In a real system, you'd send an MQTT command to revert
    }
  }

  publish(topic: string, payload: any) {
    this.client?.publish(topic, JSON.stringify(payload));
  }
}

export default new MQTTService();
