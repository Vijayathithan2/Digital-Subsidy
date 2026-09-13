package com.example.governmentsubsidy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GovernmentSubsidyApplication {

    public static void main(String[] args) {
        SpringApplication.run(GovernmentSubsidyApplication.class, args);
    }
}
