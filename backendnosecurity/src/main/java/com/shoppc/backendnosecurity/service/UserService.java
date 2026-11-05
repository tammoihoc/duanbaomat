// src/main/java/com/shoppc/backendnosecurity/service/UserService.java
package com.shoppc.backendnosecurity.service;

import com.shoppc.backendnosecurity.model.Cart;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.repository.CartRepository;
import com.shoppc.backendnosecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    @Transactional
    public User register(User user) throws Exception {
        // Kiểm tra email đã tồn tại bằng cách giải mã
        for (User existing : userRepository.findAll()) {
            if (existing.getDecryptedEmail().equals(user.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
        }
        
        // User sẽ tự động mã hóa trong @PrePersist
        User savedUser = userRepository.save(user);
        
        // Tạo giỏ hàng
        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);
        
        return savedUser;
    }
    
    @Transactional
    public User loginUser(String email, String password) throws Exception {
        for (User user : userRepository.findAll()) {
            if (user.getDecryptedEmail().equals(email) && 
                user.getDecryptedPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
    

// src/main/java/com/shoppc/backendnosecurity/service/UserService.java

// src/main/java/com/shoppc/backendnosecurity/service/UserService.java

@Transactional
public User updateUser(String id, User userDetails) throws Exception {
    System.out.println("🔄 Updating user: " + id);
    
    return userRepository.findById(id).map(user -> {
        try {
            // Lấy password cũ (đã mã hóa)
            String oldEncryptedPassword = user.getPassword();
            
            // ===== CẬP NHẬT CÁC TRƯỜNG =====
            if (userDetails.getName() != null) {
                user.setName(userDetails.getName());
                System.out.println("   Updated name");
            }
            
            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
                System.out.println("   Updated email");
            }
            
            // ===== PASSWORD - QUAN TRỌNG =====
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                String newPassword = userDetails.getPassword();
                
                // Kiểm tra nếu password mới giống password cũ (đã mã hóa)
                if (newPassword.equals(oldEncryptedPassword)) {
                    System.out.println("   Password unchanged, keeping...");
                    user.setPassword(oldEncryptedPassword);
                } else {
                    // Password mới là plain text, set để @PreUpdate mã hóa
                    System.out.println("   Updating password (plain text)");
                    user.setPassword(newPassword);
                }
            } else {
                // Giữ password cũ
                user.setPassword(oldEncryptedPassword);
            }
            
            if (userDetails.getPhone() != null) {
                user.setPhone(userDetails.getPhone());
            }
            if (userDetails.getAddress() != null) {
                user.setAddress(userDetails.getAddress());
            }
            if (userDetails.getAvatar() != null) {
                user.setAvatar(userDetails.getAvatar());
            }
            if (userDetails.getRole() != null) {
                user.setRole(userDetails.getRole());
            }
            
            User saved = userRepository.save(user);
            System.out.println("✅ User updated successfully");
            return saved;
            
        } catch (Exception e) {
            System.err.println("❌ Error updating user: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }).orElse(null);
}
    
    @Transactional
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
