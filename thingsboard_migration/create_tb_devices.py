import json
import requests
import sys

# ==========================================
# ThingsBoard REST API Automator
# ==========================================
# This script logs into ThingsBoard via its REST API, automatically provisions
# device_01 to device_10, retrieves their access tokens, and updates tb_simulator.py!

def automate_provisioning():
    print("=== ThingsBoard Automatic Device Provisioning ===")
    
    # Prompt settings
    host = input("ThingsBoard Host (default: localhost): ").strip() or "localhost"
    
    if host == "demo.thingsboard.io":
        base_url = "https://demo.thingsboard.io"
    else:
        port = input("ThingsBoard Port (default: 8080): ").strip() or "8080"
        base_url = f"http://{host}:{port}"

    username = input("Tenant Admin Username: ").strip()
    password = input("Tenant Admin Password: ").strip()
    
    if not username or not password:
        print("Error: Username and Password are required.")
        sys.exit(1)
    
    # 1. Login
    print("\n[1/3] Logging in to ThingsBoard...")
    login_url = f"{base_url}/api/auth/login"
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(login_url, json=login_data)
        response.raise_for_status()
        token = response.json().get("token")
        print("Login successful!")
    except Exception as e:
        print(f"Login failed: {e}")
        print("Please check your credentials and make sure ThingsBoard is running.")
        sys.exit(1)
        
    headers = {
        "X-Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    tokens = {}
    
    # 2. Provision Devices
    print("\n[2/3] Creating devices (device_01 to device_10)...")
    for i in range(1, 11):
        dev_name = f"device_{i:02d}"
        create_url = f"{base_url}/api/device"
        dev_data = {
            "name": dev_name,
            "type": "default",
            "label": f"Wheat Node {i}" if i <= 5 else f"Vineyard Node {i}"
        }
        
        try:
            # Create device
            create_resp = requests.post(create_url, json=dev_data, headers=headers)
            create_resp.raise_for_status()
            dev_id = create_resp.json().get("id", {}).get("id")
            
            # Fetch Credentials (Access Token)
            cred_url = f"{base_url}/api/device/{dev_id}/credentials"
            cred_resp = requests.get(cred_url, headers=headers)
            cred_resp.raise_for_status()
            access_token = cred_resp.json().get("credentialsId")
            
            tokens[dev_name] = access_token
            print(f"Successfully created {dev_name} with token: {access_token}")
        except Exception as e:
            print(f"Failed to provision {dev_name}: {e}")
            
    if not tokens:
        print("No devices were created. Exiting.")
        sys.exit(1)
        
    # 3. Update tb_simulator.py
    print("\n[3/3] Updating tb_simulator.py with generated tokens...")
    sim_path = "./tb_simulator.py"
    
    try:
        with open(sim_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Format tokens dict beautifully
        tokens_json = json.dumps(tokens, indent=4)
        target_marker = "DEVICE_TOKENS = {"
        
        # Locate the tokens dictionary in the file
        start_idx = content.find(target_marker)
        if start_idx == -1:
            print("Error: Could not locate DEVICE_TOKENS block in tb_simulator.py.")
            sys.exit(1)
            
        end_idx = content.find("}", start_idx) + 1
        
        # Replace the old dict with the new formatted tokens dictionary
        new_content = content[:start_idx] + f"DEVICE_TOKENS = {tokens_json}" + content[end_idx:]
        
        with open(sim_path, 'w', encoding='utf-8') as file:
            file.write(new_content)
            
        print("tb_simulator.py updated successfully!")
        print("\nAll done! You can now start streaming data by running: python tb_simulator.py")
    except Exception as e:
        print(f"Failed to update tb_simulator.py: {e}")

if __name__ == "__main__":
    automate_provisioning()
