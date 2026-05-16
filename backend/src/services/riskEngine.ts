import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RiskEngine {
  async process(deviceId: string, zoneId: string, current: any) {
    const { temperature, humidity, leafWetness, rainfall } = current;

    let severity = 'LOW';
    let message = 'Conditions are normal.';

    // Check for CRITICAL first
    const isHigh = await this.checkHistory(deviceId, 85, 18, 25, 72); // 6 hours
    if (isHigh && leafWetness > 8 && rainfall > 5) {
      severity = 'CRITICAL';
      message = 'Critical risk detected! High humidity, leaf wetness, and rainfall observed.';
    } else if (isHigh) {
      severity = 'HIGH';
      message = 'High risk detected! Sustained high humidity and optimal pathogen temperature.';
    } else if (await this.checkHistory(deviceId, 70, 15, 25, 36)) { // 3 hours
      severity = 'MODERATE';
      message = 'Moderate risk. Increasing humidity levels detected.';
    } else if (humidity < 70 || temperature < 15 || temperature > 35) {
      severity = 'LOW';
      message = 'Low risk. Environmental conditions are not favorable for disease.';
    }

    // Only create alert if severity is MODERATE or higher
    if (severity !== 'LOW') {
      // Check if an unresolved alert of same severity exists in the last hour
      const existingAlert = await prisma.alert.findFirst({
        where: {
          deviceId,
          severity,
          resolved: false,
          timestamp: {
            gte: new Date(Date.now() - 60 * 60 * 1000)
          }
        }
      });

      if (!existingAlert) {
        await prisma.alert.create({
          data: {
            deviceId,
            zoneId,
            severity,
            message
          }
        });
      }
    }
  }

  private async checkHistory(deviceId: string, minHum: number, minTemp: number, maxTemp: number, points: number) {
    const history = await prisma.telemetry.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: points
    });

    if (history.length < points) return false;

    return history.every(t => t.humidity >= minHum && t.temperature >= minTemp && t.temperature <= maxTemp);
  }
}

export default new RiskEngine();
