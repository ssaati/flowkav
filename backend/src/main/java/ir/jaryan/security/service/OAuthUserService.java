package ir.jaryan.security.service;

import ir.jaryan.usermanagement.role.RoleEntity;
import ir.jaryan.security.oauth2.user.OAuth2UserFactory;
import ir.jaryan.security.oauth2.user.OAuth2UserInfo;
import ir.jaryan.usermanagement.role.RoleService;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.usermanagement.user.UserRepository;
import ir.jaryan.utils.Enums;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class OAuthUserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;


    private final RoleService roleService;

    public OAuthUserService(UserRepository userRepository, RoleService roleService){
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> getUserFromOAuthReq = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = getUserFromOAuthReq.loadUser(userRequest);

        try{
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex){
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserFactory.getOAuth2User(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());

        if(oAuth2UserInfo.getEmail().isEmpty()){
            throw new OAuth2AuthenticationException("Email not found for the oauth user");
        }

        Optional<UserEntity> optionalUser = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        UserEntity user;
        if(optionalUser.isPresent()){
            user = optionalUser.get();

            if(!user.getProvider().equals(Enums.AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))){
                throw new OAuth2AuthenticationException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            updateExistingUser(user, oAuth2UserInfo);
        } else{
            registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return oAuth2User;
    }

    private void registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        UserEntity user = new UserEntity();
        user.setProvider(Enums.AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setProviderId(oAuth2UserInfo.getId());
        updateUserDetails(user, oAuth2UserInfo);

        setRoles(user);

        userRepository.save(user);
    }

    private void updateExistingUser(UserEntity existingUser, OAuth2UserInfo oAuth2UserInfo) {
        if (existingUser.getRoles() == null || existingUser.getRoles().isEmpty()) {
            setRoles(existingUser);
        }
        updateUserDetails(existingUser, oAuth2UserInfo);
        userRepository.save(existingUser);
    }

    private void updateUserDetails(UserEntity user, OAuth2UserInfo oAuth2UserInfo) {
        user.setName(oAuth2UserInfo.getName());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setImageUrl(oAuth2UserInfo.getImageUrl());
        user.setEmailVerified((boolean)oAuth2UserInfo.getAttributes().get("email_verified"));
    }

    private void setRoles(UserEntity user) {
        Set<RoleEntity> userRoles =  new HashSet<>();
        userRoles.add(roleService.getRoleByName(Enums.RoleType.ROLE_USER));
        roleService.giveRolesToUser(user, userRoles);
    }

}
