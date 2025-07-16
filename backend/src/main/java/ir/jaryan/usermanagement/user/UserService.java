package ir.jaryan.usermanagement.user;

import ir.jaryan.dto.LoginRequest;
import ir.jaryan.dto.SignupRequest;
import ir.jaryan.exception.user.DuplicateUserException;
import ir.jaryan.exception.user.UserRegistrationException;
import ir.jaryan.security.service.JwtTokenService;
import ir.jaryan.usermanagement.role.RoleService;
import ir.jaryan.usermanagement.role.RoleEntity;
import ir.jaryan.utils.Enums;
import jakarta.annotation.PostConstruct;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final JwtTokenService jwtService;
    final AuthenticationManager authenticationManager;
    final RoleService roleService;
    final UserMapper mapper;

    @PostConstruct
    public void init() {
        Optional<UserEntity> admin = userRepository.findByUsername("admin");
        if (admin.isPresent())
            return;
        UserEntity user = new UserEntity();
        user.setPassword(passwordEncoder.encode("admin"));
        user.setUsername("admin");
        user.setEmail("admin@google.com");
        user.setName("admin admin");
        user.setProvider(Enums.AuthProvider.local);
        user.setProviderId("LOCAL");
        user.setEmailVerified(false);
        user.setImageUrl(null);
        Set<RoleEntity> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(Enums.RoleType.ROLE_ADMIN));
        roleService.giveRolesToUser(user, roles);
        userRepository.save(user);

    }
    public UserService(AuthenticationManager authenticationManager, JwtTokenService jwtService, PasswordEncoder passwordEncoder, UserRepository userRepository, RoleService roleService, UserMapper mapper) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.mapper = mapper;
    }

    public ResponseEntity<?> authenticate(LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            if (auth.isAuthenticated()) {
                Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
                String jwtToken = jwtService.createToken(loginRequest.getUsername(), authorities);
//                return ResponseEntity.ok().body(jwtToken);
                return ResponseEntity.ok().body("{\"token\": \""+ jwtToken +"\"}");

            } else {
                throw new BadCredentialsException("Invalid username or password");
            }
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public ResponseEntity<?> register(SignupRequest signupRequest) {
        try{
            UserEntity user = mapper.singupRequestDtoToUserInfo(signupRequest);
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            user.setEmail(signupRequest.getEmail());
            user.setName(signupRequest.getName());
            user.setProvider(Enums.AuthProvider.local);
            user.setProviderId("LOCAL");
            user.setEmailVerified(false);
            user.setImageUrl(null);
            Set<RoleEntity> roles = new HashSet<>();
            roles.add(roleService.getRoleByName(Enums.RoleType.ROLE_USER));
            roleService.giveRolesToUser(user, roles);
            userRepository.save(user);
            return ResponseEntity.ok().body("Registration Successful");

        }catch (DataIntegrityViolationException e){
            throw new DuplicateUserException("Invalid Registration Request");
        }
        catch (Exception e){
            throw new UserRegistrationException("Invalid Registration Request");
        }
    }
    public UserEntity getCurrentUserEntity() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserEntity> byUsername = userRepository.findByUsername(username);
        if(byUsername.isPresent())
            return byUsername.get();
        return null;
    }

}
