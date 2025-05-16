package com.capstonebau2025.centralhub.dto.RemoteRequests;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ToggleAutomationRequest {
    Long ruleId;
    Boolean isEnabled;
}
