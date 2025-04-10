package com.capstonebau2025.centralhub.service.auth;

import com.capstonebau2025.centralhub.dto.GetInvitationResponse;
import com.capstonebau2025.centralhub.entity.Invitation;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.helper.PasswordGenerator;
import com.capstonebau2025.centralhub.repository.InvitationRepository;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private final RoleRepository roleRepository;

    public GetInvitationResponse generateInvitation(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        String code = PasswordGenerator.generate();

        Invitation invitation = Invitation.builder()
                .code(code)
                .role(role)
                .build();

        invitationRepository.save(invitation);
        return GetInvitationResponse.builder()
                .code(code)
                .role(role.getName())
                .build();
    }

    public Role validateInvitation(String invitationCode) {
        return invitationRepository.findByCode(invitationCode)
                .map(Invitation::getRole)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation"));
    }

    public void deleteInvitation(String invitationCode) {
        Invitation invitation = invitationRepository.findByCode(invitationCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation"));
        invitationRepository.delete(invitation);
    }
}
