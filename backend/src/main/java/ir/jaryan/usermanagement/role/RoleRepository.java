package ir.jaryan.usermanagement.role;

import ir.jaryan.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleRepository extends BaseRepository<RoleEntity, Long> {
    RoleEntity findByName(String name);
    @Query("SELECT r FROM RoleEntity r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<RoleEntity> searchRoles(@Param("searchTerm") String searchTerm);
}
