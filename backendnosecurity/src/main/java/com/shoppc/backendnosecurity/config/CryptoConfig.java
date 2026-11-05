// src/main/java/com/shoppc/backendnosecurity/config/CryptoConfig.java
package com.shoppc.backendnosecurity.config;

import com.shoppc.backendnosecurity.util.CryptoUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CryptoConfig {

    @Bean
    public Map<String, String> aesKeys() {
        // Sử dụng key cố định từ CryptoKeys
        Map<String, String> keys = new HashMap<>();
        keys.put("user", CryptoKeys.USER_KEY);
        keys.put("product", CryptoKeys.PRODUCT_KEY);
        keys.put("order", CryptoKeys.ORDER_KEY);
        keys.put("cart", CryptoKeys.CART_KEY);
        keys.put("address", CryptoKeys.ADDRESS_KEY);
        return keys;
    }
    
    @Bean
    public Map<String, String> cryptoKeyInfo() {
        // Trả về cả public và private key
        Map<String, String> info = new HashMap<>();
        info.put("publicKey", CryptoKeys.getPublicKey());
        info.put("privateKey", CryptoKeys.getPrivateKey());
        return info;
    }
}
