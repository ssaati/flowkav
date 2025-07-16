package ir.jaryan.usermanagement.role;

import ir.jaryan.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleController extends BaseController<RoleEntity, RoleEntity, Long> {
    @Autowired private RoleRepository roleRepository;

//    @GetMapping
//    public List<Role> getAllRoles() {
//        return roleRepository.findAll();
//    }

    @GetMapping("/search")
    public List<RoleEntity> searchRoles(@RequestParam String query) {
        return roleRepository.searchRoles(query);
    }

//    @PostMapping
//    public Role createRole(@RequestBody Role role) {
//        return roleRepository.save(role);
//    }

    @Override
    public RoleEntity toDto(RoleEntity entity) {
        return entity;
    }

    @Override
    public RoleEntity toEntity(RoleEntity dto, RoleEntity entity) {
        return dto;
    }

    @Override
    public RoleRepository getRepository() {
        return roleRepository;
    }
}
