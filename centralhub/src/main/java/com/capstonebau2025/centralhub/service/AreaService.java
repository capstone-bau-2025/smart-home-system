package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Area;
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
            throw new RuntimeException("Area with the same name already exists");
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
                .orElseThrow(() -> new RuntimeException("Area not found"));

        if ("GENERAL".equals(area.getName())) {
            throw new RuntimeException("Cannot delete the GENERAL area");
        }
        // TODO: move devices in this area to GENERAL area before deleting
        areaRepository.deleteById(areaId);
    }
}

