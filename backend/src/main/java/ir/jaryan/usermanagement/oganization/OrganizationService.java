package ir.jaryan.usermanagement.oganization;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final OrganizationRepository repository;

    public OrganizationService(OrganizationRepository repository) {
        this.repository = repository;
    }

    public List<OrganizationTreeDTO> getOrganizationTree() {
        List<Organization> roots = repository.findRootOrganizations();
        return roots.stream()
                .map(this::convertToTreeDTO)
                .collect(Collectors.toList());
    }

    private OrganizationTreeDTO convertToTreeDTO(Organization org) {
        OrganizationTreeDTO dto = new OrganizationTreeDTO(org.getId(), org.getTitle());
        List<Organization> children = repository.findByParentId(org.getId());

        if (!children.isEmpty()) {
            dto.setChildren(
                    children.stream()
                            .map(this::convertToTreeDTO)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }
}