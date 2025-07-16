package ir.jaryan.usermanagement.oganization;


import lombok.Data;

import java.util.List;

@Data
public class OrganizationTreeDTO {
    private String value;  // id
    private String label;  // title
    private List<OrganizationTreeDTO> children;

    public OrganizationTreeDTO(String value, String label) {
        this.value = value;
        this.label = label;
    }
}