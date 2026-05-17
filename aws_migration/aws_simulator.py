import json
import time
import random
import os
import ssl
import paho.mqtt.client as mqtt
from datetime import datetime

# ==========================================
# AWS IoT Core Configuration
# ==========================================
AWS_ENDPOINT = "YOUR_AWS_IOT_ENDPOINT-ats.iot.REGION.amazonaws.com" # REPLACE THIS
PORT = 8883

# Define paths to your certificates (you will need 1 per device ideally, but for simulation we can use one main cert if policies allow, 
# though the assignment asks for unique certs per device. For testing, place device_01 certs here).
CERTS_DIR = "./certs"
CA_PATH = os.path.join(CERTS_DIR, "AmazonRootCA1.pem")
CERT_PATH = os.path.join(CERTS_DIR, "device_01-certificate.pem.crt")
KEY_PATH = os.path.join(CERTS_DIR, "device_01-private.pem.key")

NUM_DEVICES = 10
ZONES = ["Zone_1", "Zone_2"]

class AWSDeviceSimulator:
    def __init__(self, device_id, zone_id):
        self.device_id = device_id
        self.zone_id = zone_id
        
        # OTA Thresholds
        self.moderate_humidity_min = 70
        self.high_humidity_min = 85
        
        self.client = mqtt.Client(client_id=self.device_id)
        
        # Configure TLS/SSL for AWS IoT Core
        self.client.tls_set(ca_certs=CA_PATH, certfile=CERT_PATH, keyfile=KEY_PATH, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)
        
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
    def connect(self):
        print(f"[{self.device_id}] Connecting to AWS IoT Core...")
        self.client.connect(AWS_ENDPOINT, PORT, 60)
        self.client.loop_start()

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"[{self.device_id}] Connected Successfully!")
            # Subscribe to AWS IoT Jobs topic for OTA updates
            job_topic = f"$aws/things/{self.device_id}/jobs/notify-next"
            self.client.subscribe(job_topic)
            print(f"[{self.device_id}] Subscribed to {job_topic}")
        else:
            print(f"[{self.device_id}] Connection Failed with code {rc}")

    def on_message(self, client, userdata, msg):
        print(f"[{self.device_id}] Message received on {msg.topic}: {msg.payload.decode()}")
        
        # Handle OTA Job Notification
        if "jobs/notify-next" in msg.topic:
            try:
                payload = json.loads(msg.payload.decode())
                if 'execution' in payload:
                    job_id = payload['execution']['jobId']
                    job_document = payload['execution']['jobDocument']
                    self.handle_ota_job(job_id, job_document)
            except Exception as e:
                print(f"[{self.device_id}] Error parsing job: {e}")

    def handle_ota_job(self, job_id, document):
        print(f"[{self.device_id}] Starting OTA Update Job: {job_id}")
        
        # Simulate processing time
        time.sleep(2)
        
        try:
            steps = document.get('steps', [])
            for step in steps:
                if step.get('action') == 'update_thresholds':
                    new_thresholds = step.get('payload', {})
                    self.moderate_humidity_min = new_thresholds.get('moderate_humidity_min', self.moderate_humidity_min)
                    self.high_humidity_min = new_thresholds.get('high_humidity_min', self.high_humidity_min)
                    print(f"[{self.device_id}] Applied new thresholds: Mod={self.moderate_humidity_min}, High={self.high_humidity_min}")
            
            # Send SUCCEEDED status back to AWS IoT Jobs
            status_topic = f"$aws/things/{self.device_id}/jobs/{job_id}/update"
            status_payload = {"status": "SUCCEEDED"}
            self.client.publish(status_topic, json.dumps(status_payload))
            print(f"[{self.device_id}] OTA Update SUCCEEDED")
            
        except Exception as e:
            # Simulate Failure
            print(f"[{self.device_id}] OTA Update FAILED: {e}")
            status_topic = f"$aws/things/{self.device_id}/jobs/{job_id}/update"
            status_payload = {"status": "FAILED"}
            self.client.publish(status_topic, json.dumps(status_payload))

    def generate_telemetry(self):
        # Generate realistic, fluctuating data
        temp = 20.0 + random.uniform(-5, 5)
        hum = 60.0 + random.uniform(-10, 30) # High variance to trigger alerts
        wetness = random.uniform(0, 10)
        rainfall = random.uniform(0, 15) if random.random() > 0.8 else 0.0
        
        telemetry = {
            "device_id": self.device_id,
            "zone_id": self.zone_id,
            "temperature": round(temp, 2),
            "humidity": round(hum, 2),
            "leaf_wetness": round(wetness, 2),
            "rainfall": round(rainfall, 2),
            "timestamp": datetime.now().isoformat()
        }
        
        topic = f"iot/telemetry/{self.device_id}"
        self.client.publish(topic, json.dumps(telemetry))
        print(f"[{self.device_id}] Published Telemetry: Temp={telemetry['temperature']}C, Hum={telemetry['humidity']}%")

# Create and start devices
print("Starting AWS IoT Simulation...")
devices = []

# Note: In a real scenario, you'd load unique certificates for each device.
# For testing the connection, we initialize just device_01 here if certs exist.
if os.path.exists(CERT_PATH):
    # Just running one device for the example. You can loop to run all 10 once you have certificates.
    dev = AWSDeviceSimulator("device_01", "Zone_1")
    dev.connect()
    devices.append(dev)
else:
    print(f"WARNING: Certificates not found in {CERTS_DIR}. Please download them from AWS IoT Core.")

try:
    while True:
        for d in devices:
            d.generate_telemetry()
        time.sleep(10) # Publish every 10 seconds for testing
except KeyboardInterrupt:
    print("Stopping simulator...")
    for d in devices:
        d.client.disconnect()
