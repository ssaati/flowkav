package ir.jaryan.security.handler;

import ir.jaryan.usermanagement.role.RoleEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.security.oauth2.HttpCookieOAuth2AutherizationRequestRepository;
import ir.jaryan.usermanagement.user.UserRepository;
import ir.jaryan.security.service.JwtTokenService;
import ir.jaryan.utils.CookieUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final String REDIRECT_PARAM_COOKIE_NAME = "redirect_uri";

    private final JwtTokenService jwtTokenService;

    private final UserRepository userRepository;
    private final HttpCookieOAuth2AutherizationRequestRepository httpCookieOAuth2AutherizationRequestRepository;

    public OAuth2LoginSuccessHandler(JwtTokenService jwtTokenService, UserRepository userRepository, HttpCookieOAuth2AutherizationRequestRepository httpCookieOAuth2AutherizationRequestRepository) {
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
        this.httpCookieOAuth2AutherizationRequestRepository = httpCookieOAuth2AutherizationRequestRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String email = user.getAttribute("email");

        UserEntity savedUser = userRepository.findByEmail(email).orElse(null);
        Set<RoleEntity> userRoles = savedUser != null ? savedUser.getRoles() : null;

        Collection<? extends GrantedAuthority> authorities = userRoles != null ? userRoles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList() : null;

        String token = jwtTokenService.createToken(email, authorities);

        String targetUrl = UriComponentsBuilder.fromUriString(determineTargetUrl(request, response, authentication))
                .queryParam("token", token)
                .build().toUriString();

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AutherizationRequestRepository.removeAuthorizationRequestCookie(request, response);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            try {
                throw new BadRequestException("Unauthorized Redirect URI");
            } catch (BadRequestException e) {
                throw new RuntimeException(e);
            }
        }

        return redirectUri.orElse(getDefaultTargetUrl());

    }

    private boolean isAuthorizedRedirectUri(String url) {
        URI clientRedirectUri = URI.create(url);

        return true;
    }

    private String appendTokenToUrl(String url, String token) {
        StringBuilder urlWithToken = new StringBuilder(url);
        if (url.contains("?")) {
            urlWithToken.append("&");
        } else {
            urlWithToken.append("?");
        }
        urlWithToken.append("token=").append(token);
        return urlWithToken.toString();
    }
}
