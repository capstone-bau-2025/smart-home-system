# device_config.py
import random

# Device Types (matching DeviceModel.DeviceModelType)
class DeviceType:
    LIGHT = "LIGHT"
    SWITCH = "SWITCH"
    CAMERA = "CAMERA"
    SENSOR = "SENSOR"
    OTHER = "OTHER"

# State Types (matching State.StateType)
class StateType:
    RANGE = "RANGE"
    ENUM = "ENUM"

def get_device_config():
    uid = random.randint(1000, 9999)

    return {
        "uid": uid,
        "model": "test model",
        "description": "Test device for MQTT communication",
        "type": DeviceType.SENSOR,
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "temperature",
                "type": StateType.RANGE,
                "min_range": 0,
                "max_range": 100
            },
            {
                "number": 2,
                "is_mutable": False,
                "name": "status",
                "type": StateType.ENUM,
                "choices": ["ONLINE", "OFFLINE", "STANDBY"]
            }
        ],
        "commands": [
            {
                "number": 1,
                "name": "PING",
                "description": "Check if device is responsive"
            }
        ],
        "events": [
            {
                "number": 1,
                "name": "DEVICE_STARTED",
                "description": "Device has started or restarted"
            }
        ]
    }