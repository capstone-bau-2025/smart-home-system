package com.capstonebau2025.cloudserver.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class RemoteStreamingService {

    // Store active streaming sessions
    private final Map<String, StreamSession> activeStreams = new ConcurrentHashMap<>();
    
    /**
     * Initiates a streaming session and returns a session ID
     */
    public String initiateStreamSession(String hubSerialNumber, Long cameraId, String userEmail) {
        String sessionId = UUID.randomUUID().toString();
        
        StreamSession session = new StreamSession(hubSerialNumber, cameraId, userEmail);
        activeStreams.put(sessionId, session);
        
        log.info("Initiated stream session {} for camera {} on hub {} by user {}",
                sessionId, cameraId, hubSerialNumber, userEmail);
                
        return sessionId;
    }
    
    /**
     * Called by hub to push camera stream data to cloud
     */
    public void receiveStreamFromHub(String sessionId, InputStream inputStream) {
        StreamSession session = activeStreams.get(sessionId);
        if (session != null) {
            try {
                // Create a buffered pipe with larger buffer
                PipedInputStream clientInput = new PipedInputStream(65536); // 64KB buffer
                PipedOutputStream hubOutput = new PipedOutputStream(clientInput);

                session.setInputStream(clientInput);

                // Notify waiting thread immediately
                synchronized (session) {
                    session.notifyAll();
                }

                // Process in current thread - this will block until completion
                byte[] buffer = new byte[16384];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    hubOutput.write(buffer, 0, bytesRead);
                    hubOutput.flush();
                }
                hubOutput.close();

            } catch (IOException e) {
                log.error("Error in stream processing for session {}: {}", sessionId, e.getMessage());
            }
        } else {
            log.warn("Received stream data for unknown session {}", sessionId);
        }
    }
    
    /**
     * Streams data to client browser
     */
    public void streamToClient(String sessionId, HttpServletResponse response) {
        StreamSession session = activeStreams.get(sessionId);
        if (session == null) {
            log.error("Stream session {} not found", sessionId);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        // Set appropriate headers
        response.setContentType("multipart/x-mixed-replace;boundary=frame");
        
        try (OutputStream output = response.getOutputStream()) {
            // Wait for the hub to connect and provide the stream if not already connected
            synchronized (session) {
                if (session.getInputStream() == null) {
                    session.wait(10000); // Wait up to 10 seconds for hub to connect
                }
            }
            
            if (session.getInputStream() == null) {
                log.error("Hub didn't connect within timeout for session {}", sessionId);
                response.setStatus(HttpServletResponse.SC_GATEWAY_TIMEOUT);
                return;
            }
            
            // Copy data from hub stream to client response
            byte[] buffer = new byte[8192];
            int bytesRead;
            
            InputStream hubStream = session.getInputStream();
            while ((bytesRead = hubStream.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
                output.flush();
            }
            
        } catch (IOException e) {
            log.error("Error streaming to client for session {}: {}", sessionId, e.getMessage());
        } catch (InterruptedException e) {
            log.error("Interrupted while waiting for hub stream: {}", e.getMessage());
            Thread.currentThread().interrupt();
        } finally {
            // Clean up the session
            cleanupSession(sessionId);
        }
    }
    
    private void cleanupSession(String sessionId) {
        StreamSession session = activeStreams.remove(sessionId);
        if (session != null && session.getInputStream() != null) {
            try {
                session.getInputStream().close();
            } catch (IOException e) {
                log.error("Error closing stream for session {}: {}", sessionId, e.getMessage());
            }
        }
        log.info("Cleaned up stream session {}", sessionId);
    }
    
    // Helper class to store session data
    private static class StreamSession {
        private final String hubSerialNumber;
        private final Long cameraId;
        private final String userEmail;
        private InputStream inputStream;
        
        public StreamSession(String hubSerialNumber, Long cameraId, String userEmail) {
            this.hubSerialNumber = hubSerialNumber;
            this.cameraId = cameraId;
            this.userEmail = userEmail;
        }
        
        public InputStream getInputStream() {
            return inputStream;
        }
        
        public void setInputStream(InputStream inputStream) {
            this.inputStream = inputStream;
        }
    }
}