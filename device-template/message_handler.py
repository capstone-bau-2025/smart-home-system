# message_handler.py
import importlib
import pkgutil
import logging
from handlers import *

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("MessageHandler")

class MessageHandlerRegistry:
    """Registry for message handlers"""
    def __init__(self, mqtt_client, device_config):
        self.mqtt_client = mqtt_client
        self.device_config = device_config
        self.device_uid = device_config["uid"]
        self.handlers = {}
        self.out_topic = f"device/{self.device_uid}/out"

        # Load all handlers from the handlers package
        self._load_handlers()

    def _load_handlers(self):
        """Dynamically load all handlers from handlers package"""
        handlers_package = 'handlers'

        # Get package info
        pkg = importlib.import_module(handlers_package)

        # Iterate through all modules in the package
        for _, name, _ in pkgutil.iter_modules(pkg.__path__):
            # Import the module
            module = importlib.import_module(f'{handlers_package}.{name}')

            # Find all classes that end with "Handler"
            for attr_name in dir(module):
                if attr_name.endswith('Handler'):
                    handler_class = getattr(module, attr_name)
                    # Create instance of handler
                    handler = handler_class(self.mqtt_client, self.device_config)
                    # Register handler
                    message_type = handler.get_message_type()
                    self.handlers[message_type] = handler
                    logger.info(f"Registered handler for message type: {message_type}")

    def handle_message(self, message):
        """Route message to appropriate handler"""
        message_type = message.get("message_type")

        if message_type in self.handlers:
            logger.info(f"Handling message of type: {message_type}")
            return self.handlers[message_type].handle(message)
        else:
            logger.warning(f"No handler for message type: {message_type}")
            return False