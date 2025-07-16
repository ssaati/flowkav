package ir.jaryan.security.service;

import ir.jaryan.dto.UserInfoUserDetails;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.usermanagement.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

//This class maps the user info from our db to the user details which is the object stored in spring security.
@Service
public class UserInfoUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserInfoUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("login user: " + username);
        Optional<UserEntity> userInfo = userRepository.findByUsername(username);
        System.out.println("user info: " + userInfo.get());
        return userInfo.map(UserInfoUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}