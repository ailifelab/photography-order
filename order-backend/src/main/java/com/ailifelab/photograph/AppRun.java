package com.ailifelab.photograph;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
@MapperScan("com.ailifelab.photograph.repository.**")
@SpringBootApplication
public class AppRun extends SpringBootServletInitializer {
    public static void main(String[] args) {
        SpringApplication.run(AppRun.class, args);
    }

}
