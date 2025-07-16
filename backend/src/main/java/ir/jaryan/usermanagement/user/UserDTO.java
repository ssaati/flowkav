package ir.jaryan.usermanagement.user;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String imageUrl;
    private Long boss;
    private List<Long> roles;
}
