// src/main/java/com/shoppc/backendnosecurity/util/KeyGeneratorTool.java
package com.shoppc.backendnosecurity.util;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.util.Base64;

public class KeyGeneratorTool {
    public static void main(String[] args) throws Exception {
        // Tạo AES key 256-bit
        System.out.println("=== AES KEYS (256-bit) ===");
        for (int i = 0; i < 5; i++) {
            byte[] key = new byte[32];
            new SecureRandom().nextBytes(key);
            System.out.println("AES_KEY_" + (i+1) + ": " + Base64.getEncoder().encodeToString(key));
        }
        
        // Tạo RSA key pair 2048-bit
        System.out.println("\n=== RSA KEYS (2048-bit) ===");
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.generateKeyPair();
        
        String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
        String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());
        
        System.out.println("RSA_PUBLIC_KEY:\n" + publicKey);
        System.out.println("\nRSA_PRIVATE_KEY:\n" + privateKey);
    }
}
