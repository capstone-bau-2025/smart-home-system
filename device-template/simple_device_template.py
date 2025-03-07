# simple_device_template.py
import json
import time
import paho.mqtt.client as mqtt
from datetime import datetime
from device_config import get_device_config

# MQTT Configuration
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
DEFAULT_USER = "default-user"
DEFAULT_PASSWORD = "password"

# Global variables
device_mqtt_user = None
device_mqtt_password = None
device_paired = False
mqtt_client = None
device_config = get_device_config()
DEVICE_UID = device_config["uid"]

# Topics
DISCOVERY_TOPIC = f"discovery/{DEVICE_UID}"
CONFIG_TOPIC = f"config/{DEVICE_UID}"
IN_TOPIC = f"device/{DEVICE_UID}/in"
OUT_TOPIC = f"device/{DEVICE_UID}/out"

# Message handlers
def handle_ping(client, message_data):
    """Handle PING message type by responding with PING response"""
    message_id = message_data.get("message_id")

    response = {
        "message_id": message_id,
        "message_type": "PING",
        "status": "SUCCESS",
        "timestamp": datetime.now().isoformat()
    }

    response_topic = f"{OUT_TOPIC}/{message_id}"
    client.publish(response_topic, json.dumps(response))
    print(f"Responded to PING with message_id: {message_id}")

# Map of message types to their handlers
message_handlers = {
    "PING": handle_ping
}

# MQTT callbacks
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"Connected with result code {rc}")
    if rc == 0:
        if client.username == DEFAULT_USER:
            # For the initial connection with default credentials
            client.subscribe(CONFIG_TOPIC)
            print(f"Subscribed to {CONFIG_TOPIC}")
        else:
            # For the connection with device-specific credentials
            client.subscribe(IN_TOPIC)
            print(f"Subscribed to {IN_TOPIC} with device credentials")

def on_message(client, userdata, msg):
    global device_mqtt_user, device_mqtt_password, device_paired, mqtt_client

    try:
        print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")
        payload = json.loads(msg.payload.decode())

        if msg.topic == CONFIG_TOPIC:
            # Process configuration message
            if payload.get("message_type") == "CONFIG":
                handle_config(client, payload)

        elif msg.topic == IN_TOPIC:
            # Process incoming device message
            message_type = payload.get("message_type")
            if message_type in message_handlers:
                message_handlers[message_type](client, payload)
            else:
                print(f"Unknown message type: {message_type}")

    except Exception as e:
        print(f"Error processing message: {e}")

def handle_config(client, payload):
    global device_mqtt_user, device_mqtt_password, device_paired

    message_id = payload.get("message_id")
    device_mqtt_user = payload.get("username")
    device_mqtt_password = payload.get("password")

    # Update pairing status
    device_paired = True
    print(f"Received credentials! Username: {device_mqtt_user}")

    # Reconnect with new credentials and send confirmation after
    reconnect_with_device_credentials(message_id)

def reconnect_with_device_credentials(message_id=None):
    global mqtt_client

    print("Disconnecting client with default credentials...")
    mqtt_client.disconnect()
    mqtt_client.loop_stop()

    print(f"Connecting with device credentials (user: {device_mqtt_user})...")
    # Create new client with device credentials
    device_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    device_client.username_pw_set(device_mqtt_user, device_mqtt_password)
    device_client.on_connect = on_connect
    device_client.on_message = on_message

    try:
        device_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        device_client.loop_start()
        mqtt_client = device_client  # Replace the global client

        # Send confirmation response with the new credentials
        if message_id:
            response_topic = f"{OUT_TOPIC}/{message_id}"
            response_payload = json.dumps({
                "message_id": message_id,
                "status": "PAIRED",
                "uid": DEVICE_UID,
                "timestamp": datetime.now().isoformat()
            })

            device_client.publish(response_topic, response_payload)
            print(f"Sent pairing confirmation to {response_topic} with device credentials")
            print("Successfully paired and connected with device credentials!")

            # Subscribe to the device's input topic
            device_client.subscribe(IN_TOPIC)
            print(f"Subscribed to {IN_TOPIC}")

    except Exception as e:
        print(f"Error connecting with device credentials: {e}")

def send_discovery_message(client):
    # Using device configuration that matches the Java DTO
    discovery_data = {
        "uid": device_config["uid"],
        "model": device_config["model"],
        "type": device_config["type"],
        "description": device_config["description"],
        "support_streaming": device_config["support_streaming"],
        "states": device_config.get("states", []),
        "commands": device_config.get("commands", []),
        "events": device_config.get("events", []),
        "discoveryTime": datetime.now().isoformat()
    }

    result = client.publish(DISCOVERY_TOPIC, json.dumps(discovery_data))
    if result.rc == mqtt.MQTT_ERR_SUCCESS:
        print(f"Sent discovery message to {DISCOVERY_TOPIC}")
    else:
        print(f"Failed to send discovery message, error code: {result.rc}")

def main():
    global mqtt_client

    # Set up MQTT client for discovery with default credentials
    mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    mqtt_client.username_pw_set(DEFAULT_USER, DEFAULT_PASSWORD)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        mqtt_client.loop_start()
    except Exception as e:
        print(f"Error connecting to MQTT broker: {e}")
        return

    print(f"Device UID: {DEVICE_UID}")
    print(f"Device Model: {device_config['model']}")
    print("Starting discovery process. Press Ctrl+C to exit.")

    try:
        # Main loop for discovery and pairing
        while not device_paired:
            send_discovery_message(mqtt_client)
            # Wait 30 seconds before retrying
            for i in range(30):
                if device_paired:
                    break
                time.sleep(1)

        # Keep running after pairing
        print("Device paired and running. Press Ctrl+C to exit.")
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("Script terminated by user")
    finally:
        mqtt_client.loop_stop()
        mqtt_client.disconnect()

if __name__ == "__main__":
    main()