package com.capstonebau2025.cloudserver.helper;

import java.security.SecureRandom;
public class KeyGenerator {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@-_?";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int LENGTH = 8;

    public static String generateKey() {
        StringBuilder key = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            key.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return key.toString();
    }
}
