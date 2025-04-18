package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {
    private final AreaRepository areaRepository;

    public Area addArea(String areaName) {
        if (areaRepository.existsByName(areaName)) {
            throw new ValidationException("Area already exists: " + areaName);
        }

        Area area = Area.builder()
                .name(areaName)
                .build();

        return areaRepository.save(area);
    }

    public List<Area> getAllAreas() {
        return areaRepository.findAll();
    }

    public void deleteArea(Long areaId) {
        Area area = areaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with ID: " + areaId));

        if ("GENERAL".equals(area.getName())) {
            throw new ValidationException("GENERAL area cannot be deleted.");
        }
        // TODO: move devices in this area to GENERAL area before deleting
        areaRepository.deleteById(areaId);
    }
}

