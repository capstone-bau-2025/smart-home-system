# mock_gpio.py

def setwarnings(flag):
    """Mock setting warnings flag"""
    print(f"GPIO: setwarnings({flag})")

def setmode(mode):
    """Mock setting GPIO mode"""
    print(f"GPIO: setmode({mode})")

def setup(pins, mode):
    """Mock setup GPIO pins"""
    print(f"GPIO: setup({pins}, {mode})")

def output(pins, values):
    """Mock setting output on GPIO pins"""
    # print(f"GPIO: output({pins}, {values})")

def cleanup(pins=None):
    """Mock cleanup GPIO pins"""
    print(f"GPIO: cleanup({pins})")

class PWM:
    def __init__(self, pin, frequency):
        self.pin = pin
        self.frequency = frequency
        print(f"GPIO: PWM initialized on pin {pin} at {frequency}Hz")

    def start(self, duty_cycle):
        print(f"GPIO: PWM started with duty cycle {duty_cycle}")

    def ChangeDutyCycle(self, duty_cycle):
        print(f"GPIO: PWM duty cycle changed to {duty_cycle}")

    def stop(self):
        print(f"GPIO: PWM stopped")

def PWM(pin, frequency):
    return PWM(pin, frequency)


def OUT():
    return None


def BCM():
    return None