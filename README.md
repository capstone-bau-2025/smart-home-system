# Smart Home Automation System

This repository contains the software components of our Smart Home Automation Capstone Project developed at Bahçeşehir University, May 2025. The system aims to provide a reliable  and scalable smart home experience, enabling users to automate, monitor, and control their household devices via a mobile app and remote cloud connectivity.

## Project Structure

This repository includes the following major components:

- **centralhub/** – Java Spring Boot application running localy on Raspberry Pi that manages devices, automations, and interfaces with the cloud.
- **cloudserver/** – Java Spring Boot backend to provide remote access, user authentication, and notification services.
- **mobileapp/** – React Native mobile app offering a cross-platform user interface for managing devices, viewing real-time data, and setting automations.
- **device-manager/** – Python-based component handling MQTT communication with hub that can be used as framework to quickly build custom devices.

## Features

- **Role-Based Access Control (RBAC)**: Admin and standard user roles with permission management.
- **Local Automations**: Define automation rules that are executed on the hub.
- **Remote Control**: Access your smart home from anywhere via the cloud server.
- **Real-Time Notifications**: Receive instant alerts for gas detection, motion, and automation triggers.
- **Live Camera Feed**: Stream surveillance camera feed from your home.
- **Generic Device Model**: System based on a generic device model to facilitate using custom devices.
- **Device Discovery & Pairing**: Automatically find and pair new smart devices.
- **MQTT-Based Communication**: Efficient, real-time device communication using Eclipse Mosquitto.

## Architecture
![arch diagram smart home drawio](https://github.com/user-attachments/assets/34bab232-c883-4b53-b1f3-d6cf96dcaf27)

The system architecture consists of three main software layers:

1. **Hub (Raspberry Pi)**: Manages smart devices and local automations.
2. **Cloud Server**: Facilitates secure remote access and user account management.
3. **Mobile App**: User interface to interact with the system.

## Tech Stack

| Component         | Technology                                    |
|-------------------|-----------------------------------------------|
| Backend (Hub)     | Java 21, Spring Boot, H2 Database, MQTT, mDNS |
| Backend (Cloud)   | Java 21, Spring Boot, PostgreSQL, WebSocket   |
| Frontend (App)    | React Native (Expo), Firebase Notifications   |
| DevOps & Infra    | Docker, Gradle, GitHub                        |

## Screenshots
![ui screenshots](https://github.com/user-attachments/assets/b761f3a3-2a32-4774-9f96-b41d143720d7)

## Getting Started

### Prerequisites

- Docker
- Node.js + npm
- Expo CLI (for mobile app)

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-home-capstone.git
cd smart-home-capstone
```

---

#### 2. Central Hub (Dockerized)

The `centralhub/docker` folder contains a complete Docker-based setup, including:

* A `Dockerfile` for the Spring Boot application.
* A `mosquitto.conf` file for mqtt broker configurations.
* A `docker-compose.yml` file that brings up both the Hub and MQTT broker in a single containerized environment.

##### ➤ To run the hub:

```bash
cd centralhub/docker
docker compose up --build
```

##### 🔧 Configuration Notes:

* MQTT broker (Eclipse Mosquitto) is included and auto-configured with dynamic security (`dynsec`) enabled.
* You may need to **update the path to the dynamic security plugin** in the `mosquitto.conf` file based on your operating system.
* All important variables (e.g., cloud server IP, MQTT port, admin credentials) can be configured directly in `docker-compose.yml` as environment variables.
* **Note:** The central hub currently **requires the cloud server to be running** for full functionality (authentication, notifications). Update the cloud server IP address from `docker-compose.yml` under `CLOUD_SERVER_URL`.

> ⚠️ A standalone mode for offline operation (without cloud) is under development and will be added in the future.

---

#### 3. Cloud Server

Cloud server also includes docker compose for running the application and the PostgreSQL database.

##### ➤ To run the cloud:

```bash
cd cloudserver
docker compose up --build
```

---

#### 4. Mobile App

```bash
cd mobileapp
npm install
npx expo start
```

You can test the app on physical devices or emulators using the Expo Go app.

---

#### 5. Device Manager

you can check check sample devices already in `device-manager/devices` and create your own device following same technique, after that choose which devices to run in `main.py` and run devices with the following command:

```bash
cd device-manager
python3 device_manager.py
```

you can copy main files from device manager and run different devices as separate processes on different computing units as long as they are all running on same network which mqtt broker is connected to.

---

### Deployment

* **Cloud Server**: Deployed using Docker on a Microsoft Azure VM (Ubuntu).
* **Central Hub**: Runs on Raspberry Pi with Docker. MQTT broker is bundled inside.
* **Mobile App**: Built with Expo for Android/iOS platforms.
* **Device Manager**: Lightweight script runs on devices or Pi as a separate process.

---

### Contributors

The development followed an Agile methodology using Kanban boards. Tasks were divided into hardware and software streams with iterative testing and integration across sub-teams.

---

### Contributors

* **Hamza Elzarw** – Central Hub, MQTT Configuration
* **Abdulrauf Laydi** – Cloud Server, Remote Access
* **Malak Alshrshary** – Automation & Authentication
* **Khaled Al Akkad** – Mobile App UI
* **Other Team Members** – Mechatronics & Hardware (not included in this repo)

---

### License

This project is licensed under the MIT License.
