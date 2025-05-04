package com.capstonebau2025.cloudserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CloudserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloudserverApplication.class, args);
	}

}
