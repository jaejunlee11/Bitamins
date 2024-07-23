package com.saessakmaeul.bitamin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf) -> csrf.disable());

        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/v2/api-docs", "/v3/api-docs", "/v3/api-docs/**", "/swagger-resources",
                                "/swagger-resources/**", "/configuration/ui", "/configuration/security", "/swagger-ui/**",
                                "/webjars/**", "/swagger-ui.html", "/members/**", "/test/**").permitAll()
                        .anyRequest().authenticated()
                );
//                .httpBasic(withDefaults());   // swagger때메 끔

        return http.build();
    }
}
