#!/bin/bash

# Create data and logs directories
mkdir -p /app/data/mosquitto
mkdir -p /app/logs
chmod 777 /app/data
chmod 777 /app/data/mosquitto
chmod 777 /app/logs

# Initialize dynamic security if the file doesn't exist
if [ ! -f /app/data/mosquitto/dynamic-security.json ]; then
    echo "Initializing dynamic security..."
    mosquitto_ctrl dynsec init /app/data/mosquitto/dynamic-security.json admin-central-hub central-hub-password
    chmod 777 /app/data/mosquitto/dynamic-security.json
else
    chmod 777 /app/data/mosquitto/dynamic-security.json
fi

# Update mosquitto.conf to use the new location
sed -i 's|/etc/mosquitto/dynamic-security.json|/app/data/mosquitto/dynamic-security.json|g' /etc/mosquitto/mosquitto.conf

# Start Mosquitto in background with logs to file
echo "Starting Mosquitto broker..."
/usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf > /app/logs/mosquitto.log 2>&1 &
MOSQUITTO_PID=$!

# Wait a moment for Mosquitto to start
sleep 2

# Start Spring Boot application with logs to console (which will be visible in Docker logs)
echo "Starting Spring Boot application..."
java -jar /app/app.jar &
SPRING_PID=$!

# Optional: To log Java app to file instead, use:
# java -jar /app/app.jar > /app/logs/java-app.log 2>&1 &

# Handle signals to gracefully shut down both services
trap "kill $MOSQUITTO_PID $SPRING_PID; exit" SIGINT SIGTERM

# Keep the script running
wait