package com.capstonebau2025.centralhub.dto;

import com.capstonebau2025.centralhub.entity.AutomationAction;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActionDTO {

    private Long deviceId;
    private Long ruleId;
    private Long commandId;
    private Long statusValueId;
    private String type;
    private String actionValue;

}
