package com.saessakmaeul.bitamin.config;

import com.saessakmaeul.bitamin.consultations.Entity.SerchCondition;
import org.springframework.core.convert.converter.Converter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:5173", "http://localhost:3000",
//                        "http://172.30.1.57:3000")
//                .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS");
//    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToSerchConditionConverter());
    }

    private static class StringToSerchConditionConverter implements Converter<String, SerchCondition> {
        @Override
        public SerchCondition convert(String source) {
            return SerchCondition.fromString(source);
        }
    }
}
