package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.exception.PermissionException;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveillanceService {
    private final MqttMessageProducer mqttMessageProducer;
    private final DeviceRepository deviceRepository;
    private static final Logger log = LoggerFactory.getLogger(SurveillanceService.class);
    private static final int BUFFER_SIZE = 16384;
    private static final int CONNECTION_TIMEOUT = 30000;
    private final PermissionService permissionService;

    public void streamCameraFeed(Long userId, Long deviceId, HttpServletResponse response) {
        if(!permissionService.isPermittedDevice(userId, deviceId))
            throw new PermissionException("not permitted to access this device.");

        String deviceUrl = getDeviceStreamUrl(deviceId);
        if (deviceUrl == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        configureResponseHeaders(response);
        streamFromDevice(deviceUrl, response);
    }

    public String getDeviceStreamUrl(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Camera not found with ID: " + deviceId));

        if(!device.getModel().getSupportStreaming())
            throw new ValidationException("Device does not support streaming");

        return mqttMessageProducer.getStreamLink(device.getUid());
    }

    private void configureResponseHeaders(HttpServletResponse response) {
        response.setContentType("multipart/x-mixed-replace; boundary=frame");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setHeader("Connection", "keep-alive");
    }

    private void streamFromDevice(String deviceUrl, HttpServletResponse response) {
        HttpURLConnection connection = null;
        try {
            connection = createDeviceConnection(deviceUrl);

            try (InputStream in = connection.getInputStream();
                 OutputStream out = response.getOutputStream()) {

                byte[] buffer = new byte[BUFFER_SIZE];
                int bytesRead;
                response.flushBuffer(); // Initial flush to send headers immediately
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                    out.flush(); // Important: flush after each chunk
                }
            }
        } catch (IOException e) {
            log.info("Client disconnected from stream: {}", e.getMessage());
            // Don't treat client disconnect as an error
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private HttpURLConnection createDeviceConnection(String deviceUrl) throws IOException {
        URL url = new URL(deviceUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "multipart/x-mixed-replace");
        connection.setConnectTimeout(CONNECTION_TIMEOUT);
        connection.setReadTimeout(0);
        connection.connect();
        return connection;
    }

    public List<DeviceInfoDTO> getStreamingDevices(Long userId) {
        List<Device> streamingDevices = deviceRepository.findByModelSupportStreamingTrue();
        List<Long> permittedAreaIds = permissionService.getPermittedAreas(userId)
                .stream()
                .map(Area::getId)
                .toList();

        return streamingDevices.stream()
                // Filter devices by permitted areas
                .filter(device -> permittedAreaIds.contains(device.getArea().getId()))
                .map(device -> DeviceInfoDTO.builder()
                        .id(device.getId())
                        .uid(device.getUid())
                        .name(device.getName())
                        .status(device.getStatus())
                        .lastSeen(device.getLastSeen() != null ? device.getLastSeen().toString() : null)
                        .createdAt(device.getCreatedAt() != null ? device.getCreatedAt().toString() : null)
                        .model(device.getModel().getModel())
                        .modelName(device.getModel().getName())
                        .description(device.getModel().getDescription())
                        .type(device.getModel().getType())
                        .build())
                .collect(Collectors.toList());
    }
}