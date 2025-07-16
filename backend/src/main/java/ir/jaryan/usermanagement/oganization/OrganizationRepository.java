package ir.jaryan.usermanagement.oganization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, String> {

    @Query("SELECT o FROM Organization o WHERE o.parent IS NULL")
    List<Organization> findRootOrganizations();

    List<Organization> findByParentId(String parentId);
}