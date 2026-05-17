import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime

# ==========================================
# ThingsBoard Simulator Configuration
# ==========================================
THINGSBOARD_HOST = "localhost" # or your VM IP
PORT = 1883

# Add your ThingsBoard device access tokens here after creating them in the UI!
# Format: {"device_name": "ACCESS_TOKEN"}
DEVICE_TOKENS = {
    "device_01": "PUT_TOKEN_HERE_1",
    "device_02": "PUT_TOKEN_HERE_2",
    # Add tokens for device_03 to device_10
}

class ThingsBoardSimulator:
    def __init__(self, device_name, token):
        self.device_name = device_name
        self.token = token
        self.client = mqtt.Client(client_id=self.device_name)
        
        # ThingsBoard uses the Access Token as the MQTT username
        self.client.username_pw_set(self.token)
        
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
        # Determine zone
        num = int(device_name.split('_')[1])
        self.zone_id = "Zone_1" if num <= 5 else "Zone_2"
        
        # OTA Firmware Version Tracking
        self.firmware_version = "v1.0.0"

    def connect(self):
        if self.token.startswith("PUT_TOKEN"):
            print(f"[{self.device_name}] SKIPPED: Please put your real ThingsBoard token in the script.")
            return False
            
        print(f"[{self.device_name}] Connecting to ThingsBoard...")
        try:
            self.client.connect(THINGSBOARD_HOST, PORT, 60)
            self.client.loop_start()
            return True
        except Exception as e:
            print(f"[{self.device_name}] Connection failed: {e}")
            return False

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"[{self.device_name}] Connected Successfully!")
            # Subscribe to Shared Attributes (for OTA / Configuration updates from ThingsBoard)
            self.client.subscribe("v1/devices/me/attributes")
            # Subscribe to RPC commands (for direct actions)
            self.client.subscribe("v1/devices/me/rpc/request/+")
            
            # Send initial client attributes
            self.send_attributes()
        else:
            print(f"[{self.device_name}] Connection Failed with code {rc}")

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode()
        print(f"[{self.device_name}] Received on {topic}: {payload}")
        
        # Handle OTA Update via Shared Attributes
        if "attributes" in topic:
            data = json.loads(payload)
            if "shared" in data and "target_firmware" in data["shared"]:
                target_fw = data["shared"]["target_firmware"]
                self.simulate_ota_update(target_fw)
                
    def send_attributes(self):
        # Publish static attributes to ThingsBoard (Zone and Current Firmware)
        attributes = {
            "zone": self.zone_id,
            "firmware_version": self.firmware_version
        }
        self.client.publish("v1/devices/me/attributes", json.dumps(attributes))

    def simulate_ota_update(self, new_version):
        if new_version == self.firmware_version:
            return
            
        print(f"[{self.device_name}] OTA Update Triggered: Moving to {new_version}")
        
        # Simulate download and applying (publishing telemetry status to TB)
        self.client.publish("v1/devices/me/telemetry", json.dumps({"ota_status": "DOWNLOADING"}))
        time.sleep(2)
        
        # Simulate failure rollback logic for Zone 2 (e.g. device 9 and 10 fail)
        if self.device_name in ["device_09", "device_10"]:
            print(f"[{self.device_name}] OTA Update FAILED! Rolling back.")
            self.client.publish("v1/devices/me/telemetry", json.dumps({"ota_status": "FAILED"}))
            return
            
        self.firmware_version = new_version
        self.send_attributes()
        self.client.publish("v1/devices/me/telemetry", json.dumps({"ota_status": "UPDATED"}))
        print(f"[{self.device_name}] OTA Update Complete.")

    def generate_telemetry(self):
        temp = 20.0 + random.uniform(-5, 5)
        hum = 60.0 + random.uniform(-10, 30)
        wetness = random.uniform(0, 10)
        rainfall = random.uniform(0, 15) if random.random() > 0.8 else 0.0
        
        # Local Risk Calculation (ThingsBoard Rule Engine will also do this)
        risk = "LOW"
        if hum > 85 and 18 <= temp <= 25 and wetness > 8 and rainfall > 5:
            risk = "CRITICAL"
        elif hum > 85 and 18 <= temp <= 25:
            risk = "HIGH"
        elif 70 <= hum <= 85 and 15 <= temp <= 25:
            risk = "MODERATE"
        
        telemetry = {
            "temperature": round(temp, 2),
            "humidity": round(hum, 2),
            "leaf_wetness": round(wetness, 2),
            "rainfall": round(rainfall, 2),
            "local_calculated_risk": risk
        }
        
        # Publish Telemetry to ThingsBoard
        self.client.publish("v1/devices/me/telemetry", json.dumps(telemetry))
        print(f"[{self.device_name}] Published Telemetry: Temp={telemetry['temperature']}C, Hum={telemetry['humidity']}%, Risk={risk}")

# Run Simulator
if __name__ == "__main__":
    print("Starting ThingsBoard Simulator...")
    active_devices = []
    
    for dev_name, token in DEVICE_TOKENS.items():
        sim = ThingsBoardSimulator(dev_name, token)
        if sim.connect():
            active_devices.append(sim)
            
    if not active_devices:
        print("No devices connected. Please update DEVICE_TOKENS with valid access tokens.")
    else:
        try:
            while True:
                for d in active_devices:
                    d.generate_telemetry()
                time.sleep(10)
        except KeyboardInterrupt:
            print("Stopping simulator...")
            for d in active_devices:
                d.client.disconnect()
