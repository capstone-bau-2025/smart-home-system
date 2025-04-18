package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeviceInfoDTO {

    private long id;
    private long uid;
    private String name;

    private String status;
    private String lastSeen;
    private String createdAt;

    // info that comes from device model
    private String model;
    private String modelName;
    private String description;
    private String type;
} // TODO: not used as response of hub is returned directly as Object
