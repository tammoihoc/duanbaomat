// src/main/java/com/shoppc/backendnosecurity/controller/CryptoController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.util.CryptoUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crypto")
public class CryptoController {

    @GetMapping("/public-key")
    public ResponseEntity<?> getPublicKey() {
        Map<String, String> response = new HashMap<>();
        response.put("publicKey", CryptoUtil.getPublicKeyBase64());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifySignature(@RequestBody Map<String, String> request) {
        try {
            String data = request.get("data");
            String signature = request.get("signature");
            boolean isValid = CryptoUtil.verifySignature(data, signature, CryptoUtil.getPublicKeyBase64());

            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
