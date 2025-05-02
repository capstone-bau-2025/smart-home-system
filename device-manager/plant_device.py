# plant_device.py
import random
import time
import threading
from datetime import datetime
from device_base import Device

class PlantMonitorDevice(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Initial state values
        self.soil_moisture = 70.0     # %
        self.soil_ph = 6.5            # pH scale
        self.watering_duration = 30   # seconds
        self.watering_status = "OFF"

        # Internal variables
        self.water_tank_level = 100   # %
        self.last_watering_time = 0
        self.currently_watering = False

        # Thresholds for events
        self.moisture_low_threshold = 30.0
        self.water_tank_empty_threshold = 10.0

        # Simulation parameters
        self.update_interval = 5  # seconds
        self.sim_thread = None
        self.sim_running = False

    def _start_simulation(self):
        """Start the hardware simulation"""
        if self.sim_thread is not None and self.sim_thread.is_alive():
            return

        self.sim_running = True
        self.sim_thread = threading.Thread(target=self._simulation_loop)
        self.sim_thread.daemon = True
        self.sim_thread.start()
        self.logger.info("Plant hardware simulation started")

    def _stop_simulation(self):
        """Stop the hardware simulation"""
        self.sim_running = False
        if self.sim_thread is not None:
            self.sim_thread.join(timeout=1)
        self.logger.info("Plant hardware simulation stopped")

    def _simulation_loop(self):
        """Main simulation loop that updates sensor values"""
        while self.sim_running:
            # Naturally decrease soil moisture over time
            self.soil_moisture -= random.uniform(0.2, 0.8)

            # If currently watering, increase moisture and decrease tank level
            if self.currently_watering:
                elapsed_time = time.time() - self.last_watering_time

                # If watering duration exceeded, stop watering
                if elapsed_time >= self.watering_duration:
                    self.stop_watering()
                else:
                    # Increase moisture while watering
                    self.soil_moisture += random.uniform(0.8, 1.5)
                    # Decrease water tank level
                    self.water_tank_level -= random.uniform(0.2, 0.4)

            # Ensure values stay within valid ranges
            self.soil_moisture = max(0, min(100, self.soil_moisture))
            self.water_tank_level = max(0, min(100, self.water_tank_level))

            # Random small fluctuations in pH
            self.soil_ph += random.uniform(-0.1, 0.1)
            self.soil_ph = max(3.0, min(9.0, self.soil_ph))

            # Send state updates to MQTT hub
            if self.paired:
                self.publish_state_update(1, str(round(self.soil_moisture, 1)))
                self.publish_state_update(2, str(round(self.soil_ph, 1)))

                # Check for events
                if self.soil_moisture < self.moisture_low_threshold:
                    self.publish_event(1)  # Low moisture alert

                if self.water_tank_level < self.water_tank_empty_threshold:
                    self.publish_event(2)  # Water tank empty

            time.sleep(self.update_interval)

    def start_watering(self):
        """Start the watering process"""
        if self.water_tank_level > self.water_tank_empty_threshold and not self.currently_watering:
            self.currently_watering = True
            self.last_watering_time = time.time()
            self.watering_status = "ON"

            if self.paired:
                self.publish_state_update(4, self.watering_status)

            self.logger.info(f"Started watering for {self.watering_duration} seconds")
            return True
        else:
            self.logger.warning("Cannot start watering: water tank empty or already watering")
            return False

    def stop_watering(self):
        """Stop the watering process"""
        if self.currently_watering:
            self.currently_watering = False
            self.watering_status = "OFF"

            if self.paired:
                self.publish_state_update(4, self.watering_status)

            self.logger.info("Stopped watering")
        return True

    def set_watering_duration(self, duration):
        """Set the watering duration"""
        try:
            duration = int(duration)
            if 5 <= duration <= 120:
                self.watering_duration = duration
                self.logger.info(f"Watering duration set to {duration} seconds")
                return True
            else:
                self.logger.warning(f"Invalid watering duration: {duration}")
                return False
        except ValueError:
            self.logger.warning(f"Invalid watering duration value: {duration}")
            return False

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

        # Get the actual state value
        state_value = "unknown"
        if state_number == 1:
            state_value = str(round(self.soil_moisture, 1))
        elif state_number == 2:
            state_value = str(round(self.soil_ph, 1))
        elif state_number == 3:
            state_value = str(self.watering_duration)
        elif state_number == 4:
            state_value = self.watering_status

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

        if state_number == 3:  # watering_duration
            success = self.set_watering_duration(value)
        elif state_number == 4:  # watering_status
            if value == "ON":
                success = self.start_watering()
            elif value == "OFF":
                success = self.stop_watering()

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

        success = False

        if command_number == 1:  # START_WATERING
            success = self.start_watering()
        elif command_number == 2:  # STOP_WATERING
            success = self.stop_watering()

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "status": "SUCCESS" if success else "FAILURE",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)