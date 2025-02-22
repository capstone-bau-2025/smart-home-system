package com.capstonebau2025.centralhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;

@SpringBootApplication
public class CentralhubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CentralhubApplication.class, args);

		try {
			CloudWebSocketClient client = new CloudWebSocketClient(new URI("ws://localhost:8082/hub-connection"));
			client.connect();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

