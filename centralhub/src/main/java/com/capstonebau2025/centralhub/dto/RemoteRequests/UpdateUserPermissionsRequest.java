package com.capstonebau2025.centralhub.dto.RemoteRequests;

import lombok.Data;

import java.util.List;

@Data
public class UpdateUserPermissionsRequest {
    Long targetUserId;
    List<Long> roomIds;
}
