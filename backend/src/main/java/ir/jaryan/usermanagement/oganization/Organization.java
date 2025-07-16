package ir.jaryan.usermanagement.oganization;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="TB_ORGANIZATION")
@Data
public class Organization {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Organization parent;

    // For JPA/Hibernate
    protected Organization() {}

    public Organization(String id, String title, Organization parent) {
        this.id = id;
        this.title = title;
        this.parent = parent;
    }
}
