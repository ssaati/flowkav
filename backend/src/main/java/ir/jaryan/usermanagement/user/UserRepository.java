package ir.jaryan.usermanagement.user;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String username);
    Optional<UserEntity> findByUsername(String username);
}
