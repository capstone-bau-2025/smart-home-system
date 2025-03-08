# handlers/ping_handler.py
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("PingHandler")

class PingHandler:
    def __init__(self, mqtt_client, device_config):
        self.mqtt_client = mqtt_client
        self.device_config = device_config
        self.device_uid = device_config["uid"]
        self.out_topic = f"device/{self.device_uid}/out"

    def get_message_type(self):
        """Return the message type this handler can process"""
        return "PING"

    def handle(self, message):
        """Handle PING message"""
        message_id = message.get("message_id")

        response = {
            "message_id": message_id,
            "message_type": "PING",
            "status": "SUCCESS",
            "timestamp": datetime.now().isoformat()
        }

        response_topic = f"{self.out_topic}/{message_id}"
        return self.mqtt_client.publish(response_topic, response)