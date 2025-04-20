# mqtt_client.py
import json
import time
import logging
import paho.mqtt.client as mqtt
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("MqttDevice")

class MqttClient:
    def __init__(self, device_config, broker="localhost", port=1883):
        # Device configuration
        self.device_config = device_config
        self.device_uid = device_config["uid"]
        self.paired = False

        # MQTT configuration
        self.broker = broker
        self.port = port
        self.default_user = "default-user"
        self.default_password = "password"
        self.device_username = None
        self.device_password = None
        self.client = None

        # Topics
        self.discovery_topic = f"discovery/{self.device_uid}"
        self.config_topic = f"config/{self.device_uid}"
        self.in_topic = f"device/{self.device_uid}/in"
        self.out_topic = f"device/{self.device_uid}/out"

        # Message handlers
        self.message_handlers = {}

    def register_handler(self, message_type, handler_function):
        """Register a handler function for a specific message type"""
        self.message_handlers[message_type] = handler_function
        logger.info(f"Registered handler for message type: {message_type}")

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        """Callback when MQTT client connects"""
        logger.info(f"Connected with result code {rc}")
        if rc == 0:
            if self.device_username is None:
                client.subscribe(self.config_topic)
                logger.info(f"Subscribed to {self.config_topic}")
            else:
                client.subscribe(self.in_topic)
                logger.info(f"Subscribed to {self.in_topic}")

    def _on_message(self, client, userdata, msg):
        """Message callback for MQTT client"""
        try:
            logger.info(f"Received message on topic: {msg.topic}")
            payload = json.loads(msg.payload.decode())

            if msg.topic == self.config_topic:
                self._handle_config(payload)
            elif msg.topic == self.in_topic:
                message_type = payload.get("message_type")
                if message_type in self.message_handlers:
                    self.message_handlers[message_type](self, payload)
                else:
                    logger.warning(f"No handler for message type: {message_type}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def _handle_config(self, payload):
        """Handle configuration message with device credentials"""
        if payload.get("message_type") == "CONFIG":
            message_id = payload.get("message_id")
            self.device_username = payload.get("username")
            self.device_password = payload.get("password")

            logger.info(f"Received credentials - username: {self.device_username}")

            # Disconnect from default client
            if self.client:
                self.client.disconnect()
                self.client.loop_stop()

            # Connect with device credentials
            success = self._connect_with_device_credentials()

            if success:
                # Send confirmation response
                response_topic = f"{self.out_topic}/{message_id}"
                response = {
                    "message_id": message_id,
                    "status": "SUCCESS",
                    "uid": self.device_uid,
                    "timestamp": datetime.now().isoformat()
                }

                self.client.publish(response_topic, json.dumps(response))
                logger.info(f"Sent pairing confirmation to {response_topic}")
                self.paired = True

    def _connect_with_device_credentials(self):
        """Connect with device-specific credentials"""
        try:
            client_id = f"device-{self.device_uid}"
            client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=client_id)
            client.username_pw_set(self.device_username, self.device_password)
            client.on_connect = self._on_connect
            client.on_message = self._on_message

            client.connect(self.broker, self.port, 60)
            client.loop_start()

            self.client = client
            logger.info(f"Connected with device credentials as {self.device_username}")
            return True
        except Exception as e:
            logger.error(f"Error connecting with device credentials: {e}")
            return False

    def _send_discovery(self):
        """Send discovery message to the hub"""
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

        if self.client and self.client.is_connected():
            result = self.client.publish(self.discovery_topic, json.dumps(discovery_data))
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"Sent discovery message to {self.discovery_topic}")
                return True
        return False

    def publish_response(self, message_id, response_data):
        """Publish a response to a specific message"""
        if not self.client or not self.client.is_connected():
            logger.error("Cannot publish - client not connected")
            return False

        response_topic = f"{self.out_topic}/{message_id}"
        result = self.client.publish(response_topic, json.dumps(response_data))
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            logger.info(f"Published response to {response_topic}")
            return True
        return False

    def publish_event(self, event_number):
        """Publish an event notification"""
        event_data = {
            "message_type": "EVENT",
            "device_uid": self.device_uid,
            "event_number": event_number,
            "timestamp": datetime.now().isoformat()
        }
        if self.client and self.client.is_connected():
            result = self.client.publish(self.out_topic, json.dumps(event_data))
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"Published event {event_number} to {self.out_topic}")
                return True
        return False

    def publish_state_update(self, state_number, state_value):
        """Publish a state update notification"""
        state_data = {
            "message_type": "STATE_UPDATED",
            "device_uid": self.device_uid,
            "state_number": state_number,
            "state_value": state_value,
            "timestamp": datetime.now().isoformat()
        }
        if self.client and self.client.is_connected():
            result = self.client.publish(self.out_topic, json.dumps(state_data))
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"Published state update for state {state_number} to {self.out_topic}")
                return True
        return False

    def start(self):
        """Start the device and connect to MQTT broker"""
        logger.info(f"Starting device with UID: {self.device_uid}")
        logger.info(f"Device Model: {self.device_config['model']}")

        # Connect with default credentials for discovery
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.username_pw_set(self.default_user, self.default_password)
        client.on_connect = self._on_connect
        client.on_message = self._on_message

        try:
            client.connect(self.broker, self.port, 60)
            client.loop_start()
            self.client = client

            # Run discovery loop until paired
            logger.info("Starting discovery process")
            while not self.paired:
                self._send_discovery()
                # Wait 30 seconds before retrying
                for _ in range(30):
                    if self.paired:
                        break
                    time.sleep(1)

            # Keep running after pairing
            logger.info("Device paired and running. Press Ctrl+C to exit")
            while True:
                time.sleep(1)

        except KeyboardInterrupt:
            logger.info("Device stopped by user")
        finally:
            if self.client:
                self.client.loop_stop()
                self.client.disconnect()