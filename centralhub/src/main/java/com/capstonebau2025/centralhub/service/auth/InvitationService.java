package com.capstonebau2025.centralhub.service.auth;

import com.capstonebau2025.centralhub.entity.Invitation;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.repository.InvitationRepository;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InvitationService {
    private static final Logger logger = LoggerFactory.getLogger(InvitationService.class);

    private final InvitationRepository invitationRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public InvitationService(InvitationRepository invitationRepository,
                             RoleRepository roleRepository) {
        this.invitationRepository = invitationRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public String generateInvitation(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        //TODO: use password generator instead of UUID
        String code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Invitation invitation = Invitation.builder()
                .code(code)
                .role(role)
                .build();

        invitationRepository.save(invitation);
        return code;
    }

    // TODO: instead of passing invitation object, pass invitation code
    @Transactional
    public Role validateInvitation(Invitation invitation) {
        return invitationRepository.findByCode(invitation.getCode())
                .map(Invitation::getRole)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation"));
    }
}
