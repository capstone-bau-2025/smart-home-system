# device_hardware.py
import random
import time
import threading
import logging

logger = logging.getLogger("PlantHardware")

class PlantHardware:
    def __init__(self, device_uid, mqtt_device=None):
        """Simulates hardware for a plant monitoring device"""
        self.device_uid = device_uid
        self.mqtt_device = mqtt_device
        self.running = False
        self.thread = None

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

    def start_simulation(self):
        """Start the simulation thread"""
        if self.thread is not None and self.thread.is_alive():
            return

        self.running = True
        self.thread = threading.Thread(target=self._simulation_loop)
        self.thread.daemon = True
        self.thread.start()
        logger.info("Plant hardware simulation started")

    def stop_simulation(self):
        """Stop the simulation thread"""
        self.running = False
        if self.thread is not None:
            self.thread.join(timeout=1)
        logger.info("Plant hardware simulation stopped")

    def _simulation_loop(self):
        """Main simulation loop that updates sensor values"""
        while self.running:
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
            if self.mqtt_device and self.mqtt_device.paired:
                self.mqtt_device.publish_state_update(1, str(round(self.soil_moisture, 1)))
                self.mqtt_device.publish_state_update(2, str(round(self.soil_ph, 1)))

                # Check for events
                if self.soil_moisture < self.moisture_low_threshold:
                    self.mqtt_device.publish_event(1)  # Low moisture alert

                if self.water_tank_level < self.water_tank_empty_threshold:
                    self.mqtt_device.publish_event(2)  # Water tank empty

            time.sleep(self.update_interval)

    def start_watering(self):
        """Start the watering process"""
        if self.water_tank_level > self.water_tank_empty_threshold and not self.currently_watering:
            self.currently_watering = True
            self.last_watering_time = time.time()
            self.watering_status = "ON"

            if self.mqtt_device and self.mqtt_device.paired:
                self.mqtt_device.publish_state_update(4, self.watering_status)

            logger.info(f"Started watering for {self.watering_duration} seconds")
            return True
        else:
            logger.warning("Cannot start watering: water tank empty or already watering")
            return False

    def stop_watering(self):
        """Stop the watering process"""
        if self.currently_watering:
            self.currently_watering = False
            self.watering_status = "OFF"

            if self.mqtt_device and self.mqtt_device.paired:
                self.mqtt_device.publish_state_update(4, self.watering_status)

            logger.info("Stopped watering")
        return True

    def set_watering_duration(self, duration):
        """Set the watering duration"""
        try:
            duration = int(duration)
            if 5 <= duration <= 120:
                self.watering_duration = duration
                logger.info(f"Watering duration set to {duration} seconds")
                return True
            else:
                logger.warning(f"Invalid watering duration: {duration}")
                return False
        except ValueError:
            logger.warning(f"Invalid watering duration value: {duration}")
            return False