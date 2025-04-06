package com.capstonebau2025.centralhub;

import com.capstonebau2025.centralhub.service.JwtClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CentralhubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CentralhubApplication.class, args);
	}

	@Bean
	public CommandLineRunner connectToCloudServer() {
		return args -> {
			String hubId = "hub-001"; // Your hub's unique ID

			// Get token from cloud server (fix the port)
			JwtClient jwtClient = new JwtClient("http://localhost:8082");

			// Connect to WebSocket using the token (fix the port)
			String token = jwtClient.getToken(hubId);
			HubClient hubClient = new HubClient(hubId, token);
			hubClient.connectToCloud("ws://localhost:8082/hub-socket");
		};
	}
}




//package com.capstonebau2025.centralhub;
//
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.scheduling.annotation.EnableScheduling;
//
//import java.net.URI;
//
//@EnableScheduling
//@SpringBootApplication
//public class CentralhubApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(CentralhubApplication.class, args);
//
//		try {
//			CloudWebSocketClient client = new CloudWebSocketClient(new URI("ws://localhost:8082/hub-connection"));
//			client.connect();
//			// TODO: what should happen if could not connect to cloud server?
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//}

