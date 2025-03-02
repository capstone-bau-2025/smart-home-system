package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AreaService extends GenericServiceImpl<Area, Long> {

    @Autowired
    public AreaService(AreaRepository areaRepository) {
        setRepository(areaRepository);
    }

    public Area create(Area area) {
        return super.create(area);
    }

    public Area update(Area area) {
        return super.update(area);
    }

    public Optional<Area> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<Area> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(Area area) {
        super.delete(area);
    }
}

