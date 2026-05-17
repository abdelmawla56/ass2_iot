import json
import time
import random
import os
import ssl
import paho.mqtt.client as mqtt
from datetime import datetime

# ==========================================
# Rogue Device Attack Simulation
# ==========================================
# This script simulates an attacker trying to inject false telemetry data.
# It attempts to connect to AWS IoT Core WITHOUT valid X.509 certificates
# or with an unauthorized/expired certificate to demonstrate rejection.

AWS_ENDPOINT = "YOUR_AWS_IOT_ENDPOINT-ats.iot.REGION.amazonaws.com" # REPLACE THIS
PORT = 8883

CERTS_DIR = "./certs"
CA_PATH = os.path.join(CERTS_DIR, "AmazonRootCA1.pem")

# We will intentionally NOT provide a valid client certificate and private key.
# In a real attack, they might have a self-signed cert that AWS doesn't trust.

class RogueSimulator:
    def __init__(self, device_id):
        self.device_id = device_id
        self.client = mqtt.Client(client_id=self.device_id)
        
        print("Configuring malicious connection attempt...")
        # Attempting TLS but without mutual authentication (no cert/key)
        try:
            self.client.tls_set(ca_certs=CA_PATH, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2)
        except Exception as e:
            print(f"Warning on TLS setup: {e}")

        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect

    def connect(self):
        print(f"[{self.device_id}] ATTACKER: Attempting unauthorized connection to AWS IoT Core...")
        try:
            self.client.connect(AWS_ENDPOINT, PORT, 60)
            self.client.loop_start()
        except Exception as e:
            print(f"[{self.device_id}] Connection immediately rejected by AWS: {e}")

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"[{self.device_id}] CRITICAL: Connected successfully (This should NOT happen!)")
            self.attempt_injection()
        else:
            print(f"[{self.device_id}] Connection Failed with code {rc} (EXPECTED BEHAVIOR)")

    def on_disconnect(self, client, userdata, rc):
        print(f"[{self.device_id}] Disconnected. Connection forcefully closed by server. (EXPECTED BEHAVIOR)")

    def attempt_injection(self):
        print(f"[{self.device_id}] Attempting to inject fake CRITICAL risk data...")
        fake_data = {
            "device_id": "device_01", # Spoofing a legitimate device
            "zone_id": "Zone_1",
            "temperature": 50.0, # Impossible temperature
            "humidity": 100.0,
            "leaf_wetness": 24.0,
            "rainfall": 50.0,
            "timestamp": datetime.now().isoformat(),
            "malicious_payload": "true"
        }
        topic = "iot/telemetry/device_01"
        result = self.client.publish(topic, json.dumps(fake_data))
        print(f"[{self.device_id}] Publish attempt result: {result.rc}")

if __name__ == "__main__":
    print("=== STARTING ROGUE DEVICE SIMULATION ===")
    print("Objective: Demonstrate AWS IoT Core rejecting unauthorized connections.")
    
    rogue = RogueSimulator("rogue_attacker_01")
    rogue.connect()
    
    # Wait to observe the rejection
    time.sleep(5)
    
    # In some Paho MQTT versions, the connect() might just throw an SSL error.
    # Let's try an explicit publish anyway to show it fails.
    rogue.attempt_injection()
    
    print("=== SIMULATION ENDED ===")
    print("To document this for the assignment:")
    print("1. Check AWS CloudWatch Logs for connection rejection events.")
    print("2. Take a screenshot of the terminal showing the SSL/TLS failure.")
