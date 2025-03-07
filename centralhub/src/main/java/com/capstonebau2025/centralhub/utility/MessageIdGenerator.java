package com.capstonebau2025.centralhub.utility;

public class MessageIdGenerator {
    private static final int MAX_ID = 1000000; // Define a maximum value
    private static int currentId = 0;

    public static synchronized int generateMessageId() {
        if (currentId >= MAX_ID) {
            currentId = 0; // Reset to 0 when reaching the maximum value
        }
        return ++currentId;
    }
}