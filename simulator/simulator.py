import paho.mqtt.client as mqtt
import json
import time
import random
import os
from datetime import datetime
from threading import Thread

# Configuration
BROKER = os.getenv("MQTT_BROKER_HOST", "localhost")
PORT = int(os.getenv("MQTT_BROKER_PORT", 1883))
TOPIC_TELEMETRY = "iot/telemetry"
TOPIC_OTA_CMD = "iot/ota/command"
TOPIC_OTA_STATUS = "iot/ota/status"

NUM_DEVICES = 10
ZONES = ["Zone 1", "Zone 2"]

class DeviceSimulator:
    def __init__(self, device_id, zone_id):
        self.device_id = device_id
        self.zone_id = zone_id
        self.firmware_version = "v1.0.0"
        self.status = "ONLINE"
        self.ota_status = None
        self.ota_progress = 0
        
        # Base values for environmental simulation
        self.base_temp = 20.0 + random.uniform(-5, 5)
        self.base_humidity = 60.0 + random.uniform(-10, 10)
        self.base_wetness = random.uniform(0, 5)
        self.base_rainfall = 0.0

    def generate_telemetry(self):
        # Add some variation based on "time of day"
        # We'll just use a sine wave based on real time for simplicity
        t = time.time() / 3600  # hours
        variation = 5 * (1 + 0.5 * (1 + (t % 24 - 12) / 12)) # simple day/night
        
        temp = self.base_temp + variation + random.uniform(-0.5, 0.5)
        hum = self.base_humidity + (24 - variation) + random.uniform(-1, 1)
        
        # Simulate spikes for disease risk rules
        # Nighttime humidity spikes
        is_night = (t % 24) < 6 or (t % 24) > 20
        if is_night:
            hum += 20
            
        wetness = self.base_wetness + (5 if hum > 80 else 0) + random.uniform(0, 2)
        rainfall = self.base_rainfall + (random.uniform(5, 15) if random.random() > 0.95 else 0)
        
        return {
            "deviceId": self.device_id,
            "zoneId": self.zone_id,
            "temperature": round(temp, 2),
            "humidity": round(min(hum, 100), 2),
            "leafWetness": round(wetness, 2),
            "rainfall": round(rainfall, 2),
            "timestamp": datetime.now().isoformat(),
            "firmwareVersion": self.firmware_version,
            "status": self.status
        }

    def start_ota(self, target_version, client):
        self.status = "UPDATING"
        states = ["DOWNLOADING", "DOWNLOADED", "VERIFIED", "UPDATING", "UPDATED"]
        
        # OTA failure simulation logic: 
        # If 2 or more devices fail, backend handles rollback.
        # Let's say device_09 and device_10 always fail if they are in Zone 2.
        will_fail = (self.device_id in ["device_09", "device_10"]) and ("Zone 2" in self.zone_id)

        for i, state in enumerate(states):
            if will_fail and state == "UPDATING":
                self.ota_status = "FAILED"
                self.status = "ONLINE"
                self.publish_ota_status(client, target_version)
                return
            
            self.ota_status = state
            self.ota_progress = (i + 1) * 20
            self.publish_ota_status(client, target_version)
            time.sleep(2) # Simulating time taken for each stage

        self.firmware_version = target_version
        self.status = "ONLINE"
        self.ota_status = "IDLE"
        self.ota_progress = 100
        self.publish_ota_status(client, target_version)

    def publish_ota_status(self, client, target_version):
        payload = {
            "deviceId": self.device_id,
            "version": target_version,
            "status": self.ota_status,
            "progress": self.ota_progress,
            "timestamp": datetime.now().isoformat()
        }
        client.publish(TOPIC_OTA_STATUS, json.dumps(payload))

devices = []
for i in range(1, NUM_DEVICES + 1):
    zone = ZONES[0] if i <= 5 else ZONES[1]
    devices.append(DeviceSimulator(f"device_{i:02d}", zone))

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with result code {rc}")
    client.subscribe(TOPIC_OTA_CMD)

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload)
        target_device = data.get("deviceId")
        target_version = data.get("version")
        target_zone = data.get("zoneId")

        for d in devices:
            if (target_device and d.device_id == target_device) or (target_zone and d.zone_id == target_zone):
                Thread(target=d.start_ota, args=(target_version, client)).start()
    except Exception as e:
        print(f"Error processing message: {e}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, PORT, 60)
client.loop_start()

print("Simulator started. Sending telemetry every 5 seconds...")

try:
    while True:
        for d in devices:
            telemetry = d.generate_telemetry()
            client.publish(TOPIC_TELEMETRY, json.dumps(telemetry))
        time.sleep(5)
except KeyboardInterrupt:
    print("Simulator stopped.")
    client.disconnect()
