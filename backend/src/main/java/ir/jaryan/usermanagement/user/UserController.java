package ir.jaryan.usermanagement.user;

import ir.jaryan.PageResponseUtil;
import ir.jaryan.dto.LoginRequest;
import ir.jaryan.dto.SignupRequest;
import ir.jaryan.exception.user.UserNotFoundException;
import ir.jaryan.usermanagement.role.RoleEntity;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    final UserRepository userRepository;
    final UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        return userService.authenticate(loginRequest);
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> login(@Valid @RequestBody SignupRequest signupRequest){
        return userService.register(signupRequest);
    }


    @GetMapping("/user/exception")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> testUserException() {
        throw new UserNotFoundException("User");
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<UserDTO> userDtoList = new ArrayList<>();
        for (UserEntity user : users) {
            userDtoList.add(toDTO(user));
        }
        return PageResponseUtil.convert(userDtoList);
    }
    @RequestMapping(value = "users", method = RequestMethod.POST)
    public UserEntity create(@RequestBody UserEntity UserInfo) {
        return userRepository.save(UserInfo);
    }

    @RequestMapping(value = "users/{id}", method = RequestMethod.PUT)
    public ResponseEntity<UserEntity> update(@RequestBody UserDTO userDTO, @PathVariable Long id) {
        Optional<UserEntity> byId = userRepository.findById(id);
        if(byId.isPresent()) {
            UserEntity entity = byId.get();
            return ResponseEntity.ok(userRepository.save(toEntity(userDTO, entity)));
        }
        return ResponseEntity.notFound().build();
    }

    @RequestMapping(value = "users/{id}", method = RequestMethod.GET)
    public UserDTO getById(@PathVariable Long id) {
        return toDTO(userRepository.findById(id).orElseThrow());
    }


    private UserDTO toDTO(UserEntity user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRoles(new ArrayList<>());
        if(user.getBoss() != null)
            dto.setBoss(user.getBoss().getId());
        for (RoleEntity role : user.getRoles()) {
            dto.getRoles().add(role.getId());
        }
        return dto;
    }

    private UserEntity toEntity(UserDTO dto, UserEntity entity) {
        entity.setUsername(dto.getUsername());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        if(StringUtils.hasText(dto.getPassword()))
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        if(dto.getBoss() !=null){
            UserEntity boss = new UserEntity();
            boss.setId(dto.getBoss());
            entity.setBoss(boss);
        }
        entity.setRoles(new HashSet<>());
        for (Long roleId : dto.getRoles()) {
            RoleEntity role = new RoleEntity();
            role.setId(roleId);
            entity.getRoles().add(role);
        }
        return entity;
    }
}
