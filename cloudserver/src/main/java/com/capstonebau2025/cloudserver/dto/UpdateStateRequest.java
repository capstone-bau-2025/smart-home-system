package com.capstonebau2025.cloudserver.dto;



import lombok.Data;

@Data
public class UpdateStateRequest {
    private Long stateValueId;
    private String value;
}
