# Stage 1: Build the application
FROM gradle:8.7-jdk21 AS build

# Set working directory inside the container
WORKDIR /app

# Copy gradle configuration files
COPY build.gradle.kts settings.gradle.kts ./

# Copy gradle wrapper if you have it
COPY gradlew ./
COPY gradle gradle

# Copy source code
COPY src src

# Build the application (skipping tests for faster build)
RUN gradle build --no-daemon -x test

# Stage 2: Create a lightweight runtime image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port your application runs on
EXPOSE 8082

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]