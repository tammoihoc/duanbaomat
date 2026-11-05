// src/main/java/com/shoppc/backendnosecurity/config/DataInitializer.java
package com.shoppc.backendnosecurity.config;

import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Checking for existing admin...");
        
        boolean adminExists = false;
        String adminEmail = "admin@shoppc.com";
        
        // Lấy tất cả user và kiểm tra email đã giải mã
        for (User user : userRepository.findAll()) {
            try {
                String decryptedEmail = user.getDecryptedEmail();
                System.out.println("📧 Found user: " + decryptedEmail);
                
                if (adminEmail.equals(decryptedEmail)) {
                    adminExists = true;
                    System.out.println("✅ Admin already exists!");
                    break;
                }
            } catch (Exception e) {
                // Nếu không giải mã được, có thể do key cũ -> bỏ qua
                System.out.println("⚠️ Skipping user with ID: " + user.getId() + " (cannot decrypt)");
            }
        }
        
        // Nếu chưa có admin thì tạo mới
        if (!adminExists) {
            System.out.println("📝 Creating new admin...");
            
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            
            User saved = userRepository.save(admin);
            System.out.println("✅ Admin created with ID: " + saved.getId());
        } else {
            System.out.println("ℹ️ Admin already exists, skipping creation.");
        }
        
        // Thống kê
        long totalUsers = userRepository.count();
        System.out.println("📊 Total users: " + totalUsers);
    }
}
