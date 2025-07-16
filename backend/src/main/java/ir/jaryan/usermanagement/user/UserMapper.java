package ir.jaryan.usermanagement.user;

import ir.jaryan.dto.SignupRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserEntity singupRequestDtoToUserInfo(SignupRequest signupRequest);
    SignupRequest userInfoToSignupRequest(UserEntity userInfo);

}
