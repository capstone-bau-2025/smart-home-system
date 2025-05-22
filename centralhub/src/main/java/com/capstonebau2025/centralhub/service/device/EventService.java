package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.dto.IdNameDTO;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.entity.Event;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.repository.EventRepository;
import com.capstonebau2025.centralhub.service.NotificationService;
import com.capstonebau2025.centralhub.service.automation.AutomationExecService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final DeviceRepository deviceRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final AutomationExecService automationExecService;

    // Map to track last notification time for each device-event combination
    private final Map<String, LocalDateTime> lastProcessedTimes = new ConcurrentHashMap<>();

    // Cooldown period of 1 hour
    private static final long NOTIFICATION_COOLDOWN_MINUTES = 60;

    public void handleEvent(Long deviceUid, Integer eventNumber) {
        Device device = deviceRepository.findByUid(deviceUid)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with UID: " + deviceUid));
        Event event = eventRepository.findByDeviceUidAndEventNumber(deviceUid, eventNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with device UID: " + deviceUid + " and event number: " + eventNumber));

        // Update device last seen time
        device.setLastSeen(LocalDateTime.now());
        deviceRepository.save(device);

        // Create unique key for this device-event combination
        String eventIdentifier = deviceUid + ":" + eventNumber;
        LocalDateTime now = LocalDateTime.now();

        // Check if cooldown period has elapsed since last notification
        LocalDateTime lastProcessed = lastProcessedTimes.get(eventIdentifier);
        boolean shouldProcess = lastProcessed == null ||
                lastProcessed.plusMinutes(NOTIFICATION_COOLDOWN_MINUTES).isBefore(now);

        if (shouldProcess) {
            processEvent(device, event);
            lastProcessedTimes.put(eventIdentifier, now);
            log.info("Processed event {} from device {}", eventNumber, deviceUid);
        } else {
            log.info("Skipped processing event {} from device {} (cooldown active)", eventNumber, deviceUid);
        }
    }

    private void processEvent(Device device, Event event) {
        // Send notification
        String title = "Device " + device.getName() + " triggered " + event.getName() + " event.";
        String body = event.getDescription();
        notificationService.sendDeviceNotification(device, title, body);

        automationExecService.addEvent(event.getId(), device.getId());
    }

    public List<IdNameDTO> getAllByDeviceId(Long id) {
        return eventRepository.findAllByDeviceId(id).stream()
                .map(event -> new IdNameDTO(event.getId(), event.getName()))
                .toList();
    }
}
