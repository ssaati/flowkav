package ir.jaryan.usermanagement.role;

import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.utils.Enums;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public RoleEntity getRoleByName(Enums.RoleType roleName) {
        return roleRepository.findByName(roleName.name());
    }

    public void giveRolesToUser(UserEntity user, Set<RoleEntity> roles) {
        user.setRoles(roles);
    }

}
