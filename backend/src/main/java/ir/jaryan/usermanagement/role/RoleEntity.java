package ir.jaryan.usermanagement.role;

import ir.jaryan.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_ROLE")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RoleEntity extends BaseEntity<Long> {
    @Id
    @GeneratedValue
    @Column(name = "ROLE_ID")
    @Override
    public Long getId() {
        return super.getId();
    }

    @Column(unique = true)
    private String name;
}
