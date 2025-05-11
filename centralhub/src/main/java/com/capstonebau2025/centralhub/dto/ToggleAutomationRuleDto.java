package com.capstonebau2025.centralhub.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ToggleAutomationRuleDto {

    Long ruleId;
    Boolean isEnabled;

}
