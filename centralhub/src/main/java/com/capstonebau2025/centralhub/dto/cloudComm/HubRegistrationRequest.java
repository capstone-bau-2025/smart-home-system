package com.capstonebau2025.centralhub.dto.cloudComm;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HubRegistrationRequest {
    private String serialNumber;
    private String location;
    private String name;
}
