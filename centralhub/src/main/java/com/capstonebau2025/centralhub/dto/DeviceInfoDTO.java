package com.capstonebau2025.centralhub.dto;

import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.entity.DeviceModel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeviceInfoDTO {

    private long id;
    private long uid;
    private String name;

    private Device.DeviceStatus status;
    private String lastSeen;
    private String createdAt;

    // info that comes from device model
    private String model;
    private String modelName;
    private String description;
    private DeviceModel.DeviceModelType type;
}
