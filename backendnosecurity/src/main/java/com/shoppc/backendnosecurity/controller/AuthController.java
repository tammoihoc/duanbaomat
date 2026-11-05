// src/main/java/com/shoppc/backendnosecurity/controller/AuthController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.dto.LoginRequest;
import com.shoppc.backendnosecurity.dto.RegisterRequest;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.service.AuthService;
import com.shoppc.backendnosecurity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;  // ✅ THÊM DÒNG NÀY

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);

            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("name", user.getDecryptedName());
            userResponse.put("email", user.getDecryptedEmail());
            userResponse.put("role", user.getDecryptedRole());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng ký thành công");
            response.put("user", userResponse);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);

            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("name", user.getDecryptedName());
            userResponse.put("email", user.getDecryptedEmail());
            userResponse.put("role", user.getDecryptedRole());
            userResponse.put("phone", user.getDecryptedPhone());
            userResponse.put("address", user.getDecryptedAddress());
            userResponse.put("avatar", user.getDecryptedAvatar());
            userResponse.put("signatureValid", user.isSignatureValid());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
            response.put("user", userResponse);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    // ===== CHANGE PASSWORD =====
// src/main/java/com/shoppc/backendnosecurity/controller/AuthController.java

@PostMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
    try {
        String userId = request.get("userId");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        System.out.println("🔐 Change password request:");
        System.out.println("   User ID: " + userId);
        System.out.println("   Old password: " + oldPassword);
        System.out.println("   New password: " + newPassword);
        
        // Validate
        if (newPassword == null || newPassword.length() < 8) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Mật khẩu mới phải có ít nhất 8 ký tự");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Lấy user từ database
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("👤 Found user: " + user.getId());
        System.out.println("   Encrypted password in DB: " + user.getPassword());
        
        // Giải mã mật khẩu hiện tại
        String decryptedPassword = user.getDecryptedPassword();
        System.out.println("   Decrypted password: " + decryptedPassword);
        System.out.println("   Old password provided: " + oldPassword);
        
        // Kiểm tra mật khẩu cũ
        if (!decryptedPassword.equals(oldPassword)) {
            System.out.println("❌ Password mismatch!");
            Map<String, String> error = new HashMap<>();
            error.put("error", "Mật khẩu cũ không đúng");
            return ResponseEntity.badRequest().body(error);
        }
        
        System.out.println("✅ Password matched!");
        
        // Cập nhật mật khẩu mới
        user.setPassword(newPassword);
        userService.updateUser(userId, user);
        
        System.out.println("✅ Password updated successfully!");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đổi mật khẩu thành công");
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        System.err.println("❌ Error changing password: " + e.getMessage());
        e.printStackTrace();
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}

    // ===== CHECK EMAIL =====
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            boolean exists = false;
            
            for (User user : userService.getAllUsers()) {
                try {
                    if (user.getDecryptedEmail().equals(email)) {
                        exists = true;
                        break;
                    }
                } catch (Exception e) {
                    // Bỏ qua nếu không giải mã được
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ===== RESET PASSWORD =====
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            
            if (newPassword == null || newPassword.length() < 8) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Mật khẩu phải có ít nhất 8 ký tự");
                return ResponseEntity.badRequest().body(error);
            }
            
            boolean found = false;
            for (User user : userService.getAllUsers()) {
                try {
                    if (user.getDecryptedEmail().equals(email)) {
                        user.setPassword(newPassword);
                        userService.updateUser(user.getId(), user);
                        found = true;
                        break;
                    }
                } catch (Exception e) {
                    // Bỏ qua nếu không giải mã được
                }
            }
            
            if (found) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Đặt lại mật khẩu thành công");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email không tồn tại");
                return ResponseEntity.badRequest().body(error);
            }
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
