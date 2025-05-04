# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy build configuration files
COPY build.gradle.kts settings.gradle.kts ./
COPY gradlew ./
COPY gradle gradle

# Copy source code
COPY src src

# Build the application (skip tests to make build faster)
RUN ./gradlew build --no-daemon -x test

# Stage 2: Run the application
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Create a directory for H2 database files
RUN mkdir -p /app/data

# Set the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]