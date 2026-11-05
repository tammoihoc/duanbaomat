// src/main/java/com/shoppc/backendnosecurity/service/AuthService.java
package com.shoppc.backendnosecurity.service;

import com.shoppc.backendnosecurity.dto.LoginRequest;
import com.shoppc.backendnosecurity.dto.RegisterRequest;
import com.shoppc.backendnosecurity.model.Cart;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.repository.CartRepository;
import com.shoppc.backendnosecurity.repository.UserRepository;
import com.shoppc.backendnosecurity.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Transactional
    public User register(RegisterRequest request) throws Exception {
        // Validate email
        if (!request.getEmail().matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            throw new RuntimeException("Email không hợp lệ");
        }

        // Check email exists - giải mã từng user để kiểm tra
        for (User existing : userRepository.findAll()) {
            String decryptedEmail = existing.getDecryptedEmail();
            if (decryptedEmail.equals(request.getEmail())) {
                throw new RuntimeException("Email đã được sử dụng");
            }
        }

        // Validate password
        if (request.getPassword().length() < 8) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 8 ký tự");
        }

        // Tạo user (sẽ tự động mã hóa trong @PrePersist)
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        // Tạo cart
        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);

        return savedUser;
    }

    public User login(LoginRequest request) throws Exception {
        // Duyệt tất cả user và giải mã để so sánh
        for (User user : userRepository.findAll()) {
            String decryptedEmail = user.getDecryptedEmail();
            String decryptedPassword = user.getDecryptedPassword();

            if (decryptedEmail.equals(request.getEmail()) && decryptedPassword.equals(request.getPassword())) {
                return user;
            }
        }
        throw new RuntimeException("Email hoặc mật khẩu không đúng");
    }
}
