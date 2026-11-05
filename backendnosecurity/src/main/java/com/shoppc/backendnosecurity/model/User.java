// src/main/java/com/shoppc/backendnosecurity/model/User.java
package com.shoppc.backendnosecurity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(unique = true, nullable = false, columnDefinition = "TEXT")
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String password;

    @Column(columnDefinition = "TEXT")
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String role;

    @Column(columnDefinition = "TEXT")
    private String createdAt;

    @Column(columnDefinition = "TEXT")
    private String updatedAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

    @PrePersist
    protected void onCreate() throws Exception {
        this.createdAt = encryptField(LocalDateTime.now().toString(), "user");
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "user");
        encryptFields();
        signData(getDataToSign());
    }

    @PreUpdate
    protected void onUpdate() throws Exception {
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "user");
        encryptFields();
        signData(getDataToSign());
    }

// src/main/java/com/shoppc/backendnosecurity/model/User.java

// src/main/java/com/shoppc/backendnosecurity/model/User.java

private void encryptFields() throws Exception {
    // ===== NAME =====
    if (name != null && !name.isEmpty()) {
        try {
            decryptField(name, "user");
            System.out.println("   Name already encrypted, skipping...");
        } catch (Exception e) {
            System.out.println("   Encrypting name...");
            this.name = encryptField(name, "user");
        }
    }
    
    // ===== EMAIL =====
    if (email != null && !email.isEmpty()) {
        try {
            decryptField(email, "user");
            System.out.println("   Email already encrypted, skipping...");
        } catch (Exception e) {
            System.out.println("   Encrypting email...");
            this.email = encryptField(email, "user");
        }
    }
    
    // ===== PASSWORD - QUAN TRỌNG NHẤT =====
    if (password != null && !password.isEmpty()) {
        boolean isEncrypted = false;
        try {
            String decrypted = decryptField(password, "user");
            if (decrypted != null && decrypted.length() >= 8 && decrypted.length() <= 50) {
                isEncrypted = true;
                System.out.println("   Password already encrypted, skipping...");
            }
        } catch (Exception e) {
            isEncrypted = false;
        }
        
        if (!isEncrypted) {
            System.out.println("   Encrypting password...");
            this.password = encryptField(password, "user");
        }
    }
    
    // ===== PHONE =====
    if (phone != null && !phone.isEmpty()) {
        try {
            decryptField(phone, "user");
            System.out.println("   Phone already encrypted, skipping...");
        } catch (Exception e) {
            System.out.println("   Encrypting phone...");
            this.phone = encryptField(phone, "user");
        }
    }
    
    // ===== ADDRESS =====
    if (address != null && !address.isEmpty()) {
        try {
            decryptField(address, "user");
            System.out.println("   Address already encrypted, skipping...");
        } catch (Exception e) {
            System.out.println("   Encrypting address...");
            this.address = encryptField(address, "user");
        }
    }
    
    // ===== AVATAR =====
    if (avatar != null && !avatar.isEmpty()) {
        try {
            decryptField(avatar, "user");
            System.out.println("   Avatar already encrypted, skipping...");
        } catch (Exception e) {
            System.out.println("   Encrypting avatar...");
            this.avatar = encryptField(avatar, "user");
        }
    }
    
    // ===== ROLE =====
    if (role != null && !role.isEmpty()) {
        try {
            decryptField(role, "user");
            System.out.println("   Role already encrypted, skipping...");
        } catch (Exception e) {
            System.out.println("   Encrypting role...");
            this.role = encryptField(role, "user");
        }
    }
}

    private String getDataToSign() {
        String data = "";
        data += (getId() != null ? getId() : "");
        data += (name != null ? name : "");
        data += (email != null ? email : "");
        data += (phone != null ? phone : "");
        data += (address != null ? address : "");
        data += (role != null ? role : "");
        data += (createdAt != null ? createdAt : "");
        data += (updatedAt != null ? updatedAt : "");
        return data;
    }

    // ===== GETTERS =====
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getAvatar() { return avatar; }
    public String getRole() { return role; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public Cart getCart() { return cart; }
    public List<Order> getOrders() { return orders; }

    // ===== SETTERS =====
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAddress(String address) { this.address = address; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public void setRole(String role) { this.role = role; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    public void setCart(Cart cart) { this.cart = cart; }
    public void setOrders(List<Order> orders) { this.orders = orders; }

    // ===== PHƯƠNG THỨC GIẢI MÃ =====
    public String getDecryptedName() throws Exception { return decryptField(name, "user"); }
    public String getDecryptedEmail() throws Exception { return decryptField(email, "user"); }
    public String getDecryptedPassword() throws Exception { return decryptField(password, "user"); }
    public String getDecryptedPhone() throws Exception { return decryptField(phone, "user"); }
    public String getDecryptedAddress() throws Exception { return decryptField(address, "user"); }
    public String getDecryptedAvatar() throws Exception { return decryptField(avatar, "user"); }
public String getDecryptedRole() throws Exception {
    if (role == null || role.isEmpty()) return "USER";
    return decryptField(role, "user");
}
    public LocalDateTime getDecryptedCreatedAt() throws Exception {
        String dateStr = decryptField(createdAt, "user");
        return dateStr != null && !dateStr.isEmpty() ? LocalDateTime.parse(dateStr) : null;
    }
    public LocalDateTime getDecryptedUpdatedAt() throws Exception {
        String dateStr = decryptField(updatedAt, "user");
        return dateStr != null && !dateStr.isEmpty() ? LocalDateTime.parse(dateStr) : null;
    }
    public boolean isSignatureValid() throws Exception {
        String dataToSign = getDataToSign();
        return verifySignature(dataToSign, getDataSignature());
    }
}
