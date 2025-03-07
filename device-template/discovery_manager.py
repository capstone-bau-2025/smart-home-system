# discovery_manager.py
from datetime import datetime
import logging
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DiscoveryManager")

class DiscoveryManager:
    def __init__(self, mqtt_client, device_config):
        self.mqtt_client = mqtt_client
        self.device_config = device_config
        self.device_uid = device_config["uid"]
        self.paired = False
        self.device_credentials = None

        # Topics
        self.discovery_topic = f"discovery/{self.device_uid}"
        self.config_topic = f"config/{self.device_uid}"
        self.in_topic = f"device/{self.device_uid}/in"
        self.out_topic = f"device/{self.device_uid}/out"

    def send_discovery(self):
        """Send discovery message"""
        discovery_data = {
            "uid": self.device_config["uid"],
            "model": self.device_config["model"],
            "type": self.device_config["type"],
            "description": self.device_config["description"],
            "support_streaming": self.device_config["support_streaming"],
            "states": self.device_config.get("states", []),
            "commands": self.device_config.get("commands", []),
            "events": self.device_config.get("events", []),
            "discoveryTime": datetime.now().isoformat()
        }

        return self.mqtt_client.publish(self.discovery_topic, discovery_data)

    def handle_config(self, message):
        """Handle configuration message and return credentials"""
        if message.get("message_type") == "CONFIG":
            self.device_credentials = {
                "username": message.get("username"),
                "password": message.get("password"),
                "message_id": message.get("message_id")
            }
            logger.info(f"Received credentials: {self.device_credentials['username']}")
            return self.device_credentials
        return None

    def send_pairing_confirmation(self):
        """Send pairing confirmation with the new credentials"""
        if not self.device_credentials:
            logger.error("No device credentials available")
            return False

        message_id = self.device_credentials["message_id"]
        response_topic = f"{self.out_topic}/{message_id}"
        response = {
            "message_id": message_id,
            "status": "PAIRED",
            "uid": self.device_uid,
            "timestamp": datetime.now().isoformat()
        }

        success = self.mqtt_client.publish(response_topic, response)
        if success:
            self.paired = True
            logger.info("Successfully paired with device credentials")
        return success

    def run_discovery_loop(self, default_client):
        """Run the discovery loop until paired"""
        logger.info("Starting discovery process")

        # Subscribe to config topic
        default_client.subscribe(self.config_topic)

        while not self.paired:
            self.send_discovery()
            # Wait 30 seconds before retrying
            for i in range(30):
                if self.paired:
                    break
                time.sleep(1)