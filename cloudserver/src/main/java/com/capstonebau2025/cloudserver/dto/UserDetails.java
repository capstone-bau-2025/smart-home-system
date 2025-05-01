package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDetails {
    private String username;
    private String email;
    private List<HubsConnected> hubsConnected;
}
