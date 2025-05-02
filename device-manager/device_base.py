# device_base.py
import logging
import time
import json
from datetime import datetime
import paho.mqtt.client as mqtt

class Device:
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

        # Device state
        self.running = False
        self.thread = None
        self.logger = logging.getLogger(f"Device-{self.device_uid}")

        # Setup message handlers
        self._setup_handlers()

    def _setup_handlers(self):
        """Setup message handlers - to be implemented by subclasses"""
        self.message_handlers = {
            "PING": self.handle_ping,
            "GET_STATE": self.handle_get_state,
            "SET_STATE": self.handle_set_state,
            "COMMAND": self.handle_command
        }

    # MQTT connection methods
    def _on_connect(self, client, userdata, flags, rc, properties=None):
        self.logger.info(f"Connected with result code {rc}")
        if rc == 0:
            if self.device_username is None:
                client.subscribe(self.config_topic)
                self.logger.info(f"Subscribed to {self.config_topic}")
            else:
                client.subscribe(self.in_topic)
                self.logger.info(f"Subscribed to {self.in_topic}")

    def _on_message(self, client, userdata, msg):
        try:
            self.logger.info(f"Received message on topic: {msg.topic}")
            payload = json.loads(msg.payload.decode())

            if msg.topic == self.config_topic:
                self._handle_config(payload)
            elif msg.topic == self.in_topic:
                message_type = payload.get("message_type")
                if message_type in self.message_handlers:
                    self.message_handlers[message_type](payload)
                else:
                    self.logger.warning(f"No handler for message type: {message_type}")
        except Exception as e:
            self.logger.error(f"Error processing message: {e}")

    def _handle_config(self, payload):
        if payload.get("message_type") == "CONFIG":
            message_id = payload.get("message_id")
            self.device_username = payload.get("username")
            self.device_password = payload.get("password")

            self.logger.info(f"Received credentials - username: {self.device_username}")

            # Disconnect from default client
            if self.client:
                self.client.disconnect()
                self.client.loop_stop()

            # Connect with device credentials
            success = self._connect_with_device_credentials()

            if success:
                response_topic = f"{self.out_topic}/{message_id}"
                response = {
                    "message_id": message_id,
                    "status": "SUCCESS",
                    "uid": self.device_uid,
                    "timestamp": datetime.now().isoformat()
                }

                self.client.publish(response_topic, json.dumps(response))
                self.logger.info(f"Sent pairing confirmation to {response_topic}")
                self.paired = True
                self._on_paired()

    def _connect_with_device_credentials(self):
        try:
            client_id = f"device-{self.device_uid}"
            client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=client_id)
            client.username_pw_set(self.device_username, self.device_password)
            client.on_connect = self._on_connect
            client.on_message = self._on_message

            client.connect(self.broker, self.port, 60)
            client.loop_start()

            self.client = client
            self.logger.info(f"Connected with device credentials as {self.device_username}")
            return True
        except Exception as e:
            self.logger.error(f"Error connecting with device credentials: {e}")
            return False

    def _send_discovery(self):
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
                self.logger.info(f"Sent discovery message to {self.discovery_topic}")
                return True
        return False

    # Publishing methods
    def publish_response(self, message_id, response_data):
        if not self.client or not self.client.is_connected():
            self.logger.error("Cannot publish - client not connected")
            return False

        response_topic = f"{self.out_topic}/{message_id}"
        result = self.client.publish(response_topic, json.dumps(response_data))
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            self.logger.info(f"Published response to {response_topic}")
            return True
        return False

    def publish_event(self, event_number):
        event_data = {
            "message_type": "EVENT",
            "device_uid": self.device_uid,
            "event_number": event_number,
            "timestamp": datetime.now().isoformat()
        }
        if self.client and self.client.is_connected():
            result = self.client.publish(self.out_topic, json.dumps(event_data))
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                self.logger.info(f"Published event {event_number}")
                return True
        return False

    def publish_state_update(self, state_number, state_value):
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
                self.logger.info(f"Published state update for state {state_number}")
                return True
        return False

    # Device lifecycle methods
    def start(self):
        """Start the device and connect to MQTT broker"""
        self.logger.info(f"Starting device with UID: {self.device_uid}")

        # Connect with default credentials for discovery
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.username_pw_set(self.default_user, self.default_password)
        client.on_connect = self._on_connect
        client.on_message = self._on_message

        try:
            client.connect(self.broker, self.port, 60)
            client.loop_start()
            self.client = client

            # Start discovery process
            self.logger.info("Starting discovery process")
            while not self.paired:
                self._send_discovery()
                # Wait before retrying
                time.sleep(30)

        except Exception as e:
            self.logger.error(f"Error starting device: {e}")
            if self.client:
                self.client.loop_stop()
                self.client.disconnect()

    def _on_paired(self):
        """Called when device is paired - start hardware simulation"""
        self.logger.info("Device paired successfully")
        self._start_simulation()

    def stop(self):
        """Stop the device"""
        self._stop_simulation()
        if self.client:
            self.client.loop_stop()
            self.client.disconnect()
        self.logger.info("Device stopped")

    # Abstract methods to be implemented by subclasses
    def _start_simulation(self):
        """Start the hardware simulation"""
        raise NotImplementedError("Subclasses must implement _start_simulation")

    def _stop_simulation(self):
        """Stop the hardware simulation"""
        raise NotImplementedError("Subclasses must implement _stop_simulation")

    def handle_ping(self, message):
        """Handle PING message"""
        raise NotImplementedError("Subclasses must implement handle_ping")

    def handle_get_state(self, message):
        """Handle GET_STATE message"""
        raise NotImplementedError("Subclasses must implement handle_get_state")

    def handle_set_state(self, message):
        """Handle SET_STATE message"""
        raise NotImplementedError("Subclasses must implement handle_set_state")

    def handle_command(self, message):
        """Handle COMMAND message"""
        raise NotImplementedError("Subclasses must implement handle_command")