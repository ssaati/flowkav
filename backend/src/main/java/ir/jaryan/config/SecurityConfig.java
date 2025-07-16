package ir.jaryan.config;

import ir.jaryan.usermanagement.role.RoleRepository;
import ir.jaryan.security.RestAuthenticationEntryPoint;
import ir.jaryan.security.filter.JwtAuthenticationFilter;
import ir.jaryan.security.handler.CustomAccessDeniedHandler;
import ir.jaryan.security.handler.OAuth2LoginSuccessHandler;
import ir.jaryan.security.oauth2.HttpCookieOAuth2AutherizationRequestRepository;
import ir.jaryan.security.service.JwtTokenService;
import ir.jaryan.security.service.OAuthUserService;
import ir.jaryan.usermanagement.role.RoleService;
import ir.jaryan.usermanagement.user.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtTokenService jwtTokenService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoleService roleService;
    private final HttpCookieOAuth2AutherizationRequestRepository httpCookieOAuth2AutherizationRequestRepository;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final UserDetailsService userDetailsService;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    public SecurityConfig(JwtTokenService jwtTokenService, UserRepository userRepository, RoleRepository roleRepository, HttpCookieOAuth2AutherizationRequestRepository httpCookieOAuth2AutherizationRequestRepository, UserDetailsService userDetailsService, RestAuthenticationEntryPoint restAuthenticationEntryPoint, CustomAccessDeniedHandler customAccessDeniedHandler, RoleService roleService) {
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.httpCookieOAuth2AutherizationRequestRepository = httpCookieOAuth2AutherizationRequestRepository;
        this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
        this.userDetailsService = userDetailsService;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.roleService = roleService;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenService, userDetailsService);
    }

    //Security Filter chain: Contains policies for all the security
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests ->{
                    authorizeRequests.requestMatchers(HttpMethod.OPTIONS).permitAll();
//                    authorizeRequests
//                                .requestMatchers("/api/v1/auth/**", "/error").permitAll()
//                                .requestMatchers("/index.html").permitAll()
//                                .requestMatchers("/assets/**").permitAll()
//                                .requestMatchers("/fonts/**").permitAll()
//                                .requestMatchers("/surveyjs/**").permitAll()
//                                .anyRequest().authenticated();
                    authorizeRequests
                                .requestMatchers("/api/v1/auth/login").permitAll()
                                .requestMatchers("/api/**").authenticated()
                                .anyRequest().permitAll();
                     }
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authEndpoint ->
                                authEndpoint
                                        .authorizationRequestRepository(httpCookieOAuth2AutherizationRequestRepository))
                        .redirectionEndpoint(redirect ->
                                redirect
                                        .baseUri("/login/oauth2/code/*"))
                        .userInfoEndpoint(userInfo ->
                                userInfo
                                        .userService(oAuth2UserService())
                        )
                        .successHandler(new OAuth2LoginSuccessHandler(jwtTokenService, userRepository, httpCookieOAuth2AutherizationRequestRepository))
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(restAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler))
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(jwtTokenService.getSecretKey()).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        return new OAuthUserService(userRepository, roleService);
    }

    //Instead of using WEBMVC cors you can use this cors configurations also
    //    @Bean
    //    CorsConfigurationSource corsConfigurationSource() {
    //        CorsConfiguration configuration = new CorsConfiguration();
    //        configuration.setAllowCredentials(true);
    //        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080", "http://localhost:5173"));
    //        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    //        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
    //        configuration.setExposedHeaders(Arrays.asList("Authorization"));
    //        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //        source.registerCorsConfiguration("/**", configuration);
    //        return source;
    //    }

}
