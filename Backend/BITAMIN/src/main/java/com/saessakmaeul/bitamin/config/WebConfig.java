package com.saessakmaeul.bitamin.config;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import org.springframework.core.convert.converter.Converter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // 허용할 도메인 명시
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true); // 자격 증명을 포함한 요청을 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }



    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToSerchConditionConverter());
    }

    private static class StringToSerchConditionConverter implements Converter<String, SearchCondition> {
        @Override
        public SearchCondition convert(String source) {
            return SearchCondition.fromString(source);
        }
    }
}
