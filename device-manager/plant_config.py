# plant_config.py
import random

# Device Types
class DeviceType:
    LIGHT = "LIGHT"
    SWITCH = "SWITCH"
    CAMERA = "CAMERA"
    SENSOR = "SENSOR"
    OTHER = "OTHER"

# State Types
class StateType:
    RANGE = "RANGE"
    ENUM = "ENUM"

def get_device_config():
    uid = random.randint(1000, 9999)

    return {
        "uid": uid,
        "model": "PLANT-MONITOR-1000",
        "description": "Smart Plant Monitoring and Irrigation System",
        "type": DeviceType.SENSOR,
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": False,
                "name": "soil_moisture",
                "type": StateType.RANGE,
                "min_range": 0,
                "max_range": 100
            },
            {
                "number": 2,
                "is_mutable": False,
                "name": "soil_ph",
                "type": StateType.RANGE,
                "min_range": 3.0,
                "max_range": 9.0
            },
            {
                "number": 3,
                "is_mutable": True,
                "name": "watering_duration",
                "type": StateType.RANGE,
                "min_range": 5,
                "max_range": 120
            },
            {
                "number": 4,
                "is_mutable": True,
                "name": "watering_status",
                "type": StateType.ENUM,
                "choices": ["OFF", "ON"]
            }
        ],
        "commands": [
            {
                "number": 1,
                "name": "START_WATERING",
                "description": "Start watering the plant"
            },
            {
                "number": 2,
                "name": "STOP_WATERING",
                "description": "Stop watering the plant"
            }
        ],
        "events": [
            {
                "number": 1,
                "name": "LOW_MOISTURE_ALERT",
                "description": "Soil moisture below threshold"
            },
            {
                "number": 2,
                "name": "WATER_TANK_EMPTY",
                "description": "Water tank needs refilling"
            }
        ]
    }