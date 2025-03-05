package com.capstonebau2025.cloudserver.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HubRegistrationRequest {
    private Long serialNumber;
    private String location;
    private String name;
}
