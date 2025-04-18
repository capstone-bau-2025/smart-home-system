package com.capstonebau2025.cloudserver.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateUserPermissionsRequest {
    Long targetUserId;
    List<Long> roomIds;
}
