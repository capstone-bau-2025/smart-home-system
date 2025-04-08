package com.capstonebau2025.centralhub.dto.cloudComm;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetTokenRequest {
    private String serialNumber;
    private String key;
}
