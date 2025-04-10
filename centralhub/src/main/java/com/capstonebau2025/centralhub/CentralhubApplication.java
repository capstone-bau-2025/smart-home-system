package com.capstonebau2025.centralhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CentralhubApplication {
	public static void main(String[] args) {
		SpringApplication.run(CentralhubApplication.class, args);
	}
}


