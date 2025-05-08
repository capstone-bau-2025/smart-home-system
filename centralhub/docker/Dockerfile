# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy build configuration files
COPY ../build.gradle.kts settings.gradle.kts ./
COPY ../gradlew ./
COPY ../gradle gradle

# Copy source code
COPY ../src src

# Build the application (skip tests to make build faster)
RUN ./gradlew build --no-daemon -x test

# Stage 2: Run the application
FROM eclipse-temurin:21-jre

WORKDIR /app

# Install Mosquitto with dynamic security support
RUN apt-get update && apt-get install -y \
    mosquitto \
    mosquitto-clients \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Create directories for H2 database and Mosquitto
RUN mkdir -p /app/data /etc/mosquitto/conf.d

# Configure Mosquitto with dynamic security
COPY docker/mosquitto.conf /etc/mosquitto/mosquitto.conf

# Create a startup script
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports for Spring Boot and Mosquitto
EXPOSE 8080 1883 9001

# Run both services using the startup script
CMD ["/app/start.sh"]