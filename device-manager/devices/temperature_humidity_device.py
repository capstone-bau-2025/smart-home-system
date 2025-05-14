# temperature_humidity_device.py
import time
import threading
import random
from datetime import datetime
from device_base import Device

# Mock DHT sensor for testing
# Replace with real Adafruit_DHT when using on Raspberry Pi
class MockDHT:
    def __init__(self):
        self.DHT11 = None

    @staticmethod
    def read_retry(sensor, pin):
        # Generate mock values
        humidity = random.uniform(30, 80)
        temperature = random.uniform(15, 35)
        return humidity, temperature

# Use this import on Raspberry Pi
# import Adafruit_DHT
# For testing, use the mock:
Adafruit_DHT = MockDHT()

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Sensor configuration
        self.sensor = Adafruit_DHT.DHT11
        self.pin = 4  # DHT11 connected to GPIO4

        # Sensor state
        self.status = "OFF"
        self.temperature = 0
        self.humidity = 0

        # Reading thread
        self.reading_thread = None
        self.should_stop = False

        # Sensor readings lock
        self.sensor_lock = threading.Lock()

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Start the sensor monitoring thread"""
        self.status = "ON"
        self.should_stop = False

        # Start sensor reading thread
        self.reading_thread = threading.Thread(target=self._sensor_loop)
        self.reading_thread.daemon = True
        self.reading_thread.start()
        self.logger.info("Temperature & humidity sensor started")

    def _stop_device(self):
        """Stop the sensor monitoring thread"""
        self.status = "OFF"
        self.should_stop = True

        if self.reading_thread and self.reading_thread.is_alive():
            self.reading_thread.join(timeout=2)

        self.logger.info("Temperature & humidity sensor stopped")

    def _sensor_loop(self):
        """Main sensor reading loop"""
        while not self.should_stop:
            try:
                # Read from DHT11 sensor
                humidity, temperature = Adafruit_DHT.read_retry(self.sensor, self.pin)

                if humidity is not None and temperature is not None:
                    with self.sensor_lock:
                        self.temperature = round(temperature, 1)
                        self.humidity = round(humidity, 1)

                    self.logger.info(f"Temp={self.temperature:.1f}°C  Humidity={self.humidity:.1f}%")

                    # Update states via MQTT
                    if self.paired:
                        self.publish_state_update(2, self.temperature)
                        self.publish_state_update(3, self.humidity)

                    # Check for temperature event
                    if self.temperature > 25:
                        self.logger.info("Temperature exceeded 25°C! Sending event...")
                        self.publish_event(1)  # TEMP_ABOVE_25C event
                else:
                    self.logger.warning("Failed to read from DHT11 sensor")

                # Wait between readings (3 minutes = 180 seconds)
                # Using smaller intervals and checking should_stop allows for faster shutdown
                for _ in range(18):  # 18 * 10 seconds = 180 seconds
                    if self.should_stop:
                        break
                    time.sleep(10)

            except Exception as e:
                self.logger.error(f"Error reading sensor: {e}")
                time.sleep(10)  # Wait before retry

    def set_sensor_state(self, state):
        """Set sensor active state (ON/OFF)"""
        if state not in ["ON", "OFF"]:
            self.logger.error(f"Invalid sensor state: {state}")
            return False

        if state == self.status:
            return True  # Already in requested state

        self.logger.info(f"Setting sensor state to: {state}")

        if state == "ON":
            self._start_device()
        else:
            self._stop_device()

        # Notify hub about state change
        if self.paired:
            self.publish_state_update(1, state)

        return True

    # Message handlers implementation
    def handle_ping(self, message):
        """Handle PING message from hub"""
        message_id = message.get("message_id")

        response = {
            "message_id": message_id,
            "message_type": "PING",
            "status": "SUCCESS",
            "uid": self.device_uid,
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)
        self.logger.info(f"Responded to PING message with ID: {message_id}")

    def handle_get_state(self, message):
        """Handle GET_STATE message from hub"""
        message_id = message.get("message_id")
        state_number = message.get("state_number")

        state_value = "unknown"

        if state_number == 1:  # Status
            state_value = self.status
        elif state_number == 2:  # Temperature
            state_value = self.temperature
        elif state_number == 3:  # Humidity
            state_value = self.humidity
        else:
            self.logger.warning(f"Unknown state number: {state_number}")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "state_number": state_number,
            "value": state_value,
            "status": "SUCCESS",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)
        self.logger.info(f"Responded to GET_STATE for state {state_number} with value: {state_value}")

    def handle_set_state(self, message):
        """Handle SET_STATE message from hub"""
        message_id = message.get("message_id")
        state_number = message.get("state_number")
        value = message.get("value")

        success = False

        if state_number == 1:  # Status
            success = self.set_sensor_state(value)
        elif state_number in [2, 3]:  # Temperature, Humidity
            self.logger.warning(f"Cannot set state {state_number} (read-only)")
            success = False
        else:
            self.logger.error(f"Unknown state number: {state_number}")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "status": "SUCCESS" if success else "FAILURE",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)

    def handle_command(self, message):
        """Handle COMMAND message from hub"""
        message_id = message.get("message_id")
        command_number = message.get("command_number")

        # No commands defined for this device
        self.logger.error(f"Received unsupported command: {command_number}")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "status": "FAILURE",
            "reason": "No commands supported for this device",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)

def get_device_config():
    uid = random.randint(1000, 9999)

    return {
        "uid": uid,
        "model": "DHT11 Temperature & Humidity Sensor",
        "description": "Temperature & Humidity Sensor",
        "type": "SENSOR",
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": "ENUM",
                "choices": ["ON", "0FF"]
            },
            {
                "number": 2,
                "is_mutable": False,
                "name": "temperature",
                "type": "RANGE",
                "min_range": 0,
                "max_range": 50
            },
            {
                "number": 3,
                "is_mutable": False,
                "name": "humidity",
                "type": "RANGE",
                "min_range": 20,
                "max_range": 90
            }
        ],
        "commands": [
        ],
        "events": [
            {
                "number": 1,
                "name": "TEMP_ABOVE_25C",
                "description": "Fan will be opened."
            }
        ]
    }