// src/main/java/com/shoppc/backendnosecurity/controller/UserController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> decryptedUsers = users.stream()
            .map(this::decryptUser)
            .collect(Collectors.toList());
        return ResponseEntity.ok(decryptedUsers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
            .map(this::decryptUser)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("user", decryptUser(savedUser));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");
            
            User user = userService.loginUser(email, password);
            
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", decryptUser(user));
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    private Map<String, Object> decryptUser(User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("id", user.getId());
            result.put("name", user.getDecryptedName());
            result.put("email", user.getDecryptedEmail());
            result.put("phone", user.getDecryptedPhone());
            result.put("address", user.getDecryptedAddress());
            result.put("avatar", user.getDecryptedAvatar());
            result.put("role", user.getDecryptedRole());
            result.put("createdAt", user.getDecryptedCreatedAt());
            result.put("updatedAt", user.getDecryptedUpdatedAt());
            result.put("signatureValid", user.isSignatureValid());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
