# device_template.py
import json
import time
import logging
from mqtt_client import MqttClient
from discovery_manager import DiscoveryManager
from message_handler import MessageHandlerRegistry
from device_config import get_device_config

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DeviceTemplate")

# MQTT Configuration
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
DEFAULT_USER = "default-user"
DEFAULT_PASSWORD = "password"

class DeviceTemplate:
    def __init__(self):
        # Get device configuration
        self.device_config = get_device_config()
        self.device_uid = self.device_config["uid"]

        # Initialize components
        self.mqtt_client = MqttClient(MQTT_BROKER, MQTT_PORT, self.device_uid)
        self.discovery_manager = DiscoveryManager(self.mqtt_client, self.device_config)
        self.message_handlers = None  # Will initialize after pairing

        # Topics
        self.config_topic = f"config/{self.device_uid}"
        self.in_topic = f"device/{self.device_uid}/in"

    def on_connect(self, client, userdata, flags, rc, properties=None):
        """Callback when MQTT client connects"""
        logger.info(f"Connected with result code {rc}")

    def on_connect_default(self, client, userdata, flags, rc, properties=None):
        """Callback when default client connects"""
        logger.info(f"Default client connected with result code {rc}")
        if rc == 0:
            self.mqtt_client.subscribe(self.config_topic)

    def on_connect_device(self, client, userdata, flags, rc, properties=None):
        """Callback when device client connects"""
        logger.info(f"Device client connected with result code {rc}")
        if rc == 0:
            self.mqtt_client.subscribe(self.in_topic)

    def on_message_default(self, client, userdata, msg):
        """Message callback for default client"""
        try:
            logger.info(f"Received message on topic {msg.topic}")
            payload = json.loads(msg.payload.decode())

            if msg.topic == self.config_topic:
                credentials = self.discovery_manager.handle_config(payload)
                if credentials:
                    # Disconnect default client
                    self.mqtt_client.disconnect()

                    # Connect with device credentials
                    success = self.mqtt_client.connect(
                        credentials["username"],
                        credentials["password"],
                        self.on_connect_device,
                        self.on_message_device
                    )

                    if success:
                        # Initialize message handlers now that we're connected
                        self.message_handlers = MessageHandlerRegistry(self.mqtt_client, self.device_config)
                        # Send pairing confirmation
                        self.discovery_manager.send_pairing_confirmation()
        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def on_message_device(self, client, userdata, msg):
        """Message callback for device client"""
        try:
            logger.info(f"Received message on topic {msg.topic}")
            payload = json.loads(msg.payload.decode())

            if msg.topic == self.in_topic:
                if self.message_handlers:
                    self.message_handlers.handle_message(payload)
        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def start(self):
        """Start the device template"""
        logger.info(f"Starting device template for UID: {self.device_uid}")
        logger.info(f"Device Model: {self.device_config['model']}")

        # Connect with default credentials for discovery
        self.mqtt_client.connect(
            DEFAULT_USER,
            DEFAULT_PASSWORD,
            self.on_connect_default,
            self.on_message_default
        )

        # Run discovery loop
        try:
            # Run discovery until paired
            self.discovery_manager.run_discovery_loop(self.mqtt_client)

            # Keep running after pairing
            logger.info("Device running. Press Ctrl+C to exit.")
            while True:
                time.sleep(1)

        except KeyboardInterrupt:
            logger.info("Device template stopped by user")
        finally:
            self.mqtt_client.disconnect()


if __name__ == "__main__":
    template = DeviceTemplate()
    template.start()
