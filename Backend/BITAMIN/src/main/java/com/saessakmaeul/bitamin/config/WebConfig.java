package com.saessakmaeul.bitamin.config;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import org.springframework.core.convert.converter.Converter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

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
