# mqtt_client.py
import paho.mqtt.client as mqtt
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("MqttClient")

class MqttClient:
    def __init__(self, broker, port, device_uid):
        self.broker = broker
        self.port = port
        self.device_uid = device_uid
        self.client = None
        self.subscribed_topics = []

    def connect(self, username, password, on_connect, on_message):
        """Connect to MQTT broker with given credentials"""
        client_id = f"device-{self.device_uid}-{username}"
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=client_id)
        self.client.username_pw_set(username, password)
        self.client.on_connect = on_connect
        self.client.on_message = on_message

        try:
            self.client.connect(self.broker, self.port, 60)
            self.client.loop_start()
            logger.info(f"Connected to MQTT broker as {username}")
            return True
        except Exception as e:
            logger.error(f"Error connecting to MQTT broker: {e}")
            return False

    def disconnect(self):
        """Disconnect from MQTT broker"""
        if self.client:
            for topic in self.subscribed_topics:
                self.client.unsubscribe(topic)
            self.client.loop_stop()
            self.client.disconnect()
            logger.info("Disconnected from MQTT broker")

    def subscribe(self, topic):
        """Subscribe to a topic"""
        if self.client:
            self.client.subscribe(topic)
            self.subscribed_topics.append(topic)
            logger.info(f"Subscribed to {topic}")

    def publish(self, topic, message):
        """Publish a message to a topic"""
        if self.client:
            if isinstance(message, dict):
                message = json.dumps(message)
            result = self.client.publish(topic, message)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"Published to {topic}")
                return True
            else:
                logger.error(f"Failed to publish to {topic}, error code: {result.rc}")
                return False
        return False