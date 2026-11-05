// src/main/java/com/shoppc/backendnosecurity/model/Cart.java
package com.shoppc.backendnosecurity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart extends BaseEntity {

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String createdAt;

    @Column(columnDefinition = "TEXT")
    private String updatedAt;

    @PrePersist
    protected void onCreate() throws Exception {
        this.createdAt = encryptField(LocalDateTime.now().toString(), "cart");
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "cart");
    }

    @PreUpdate
    protected void onUpdate() throws Exception {
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "cart");
    }

    // ✅ Sửa: Lấy giá trị đã giải mã để tính
    public Long getTotalPrice() {
        return items.stream()
            .mapToLong(item -> {
                try {
                    return item.getDecryptedPrice() * item.getDecryptedQuantity();
                } catch (Exception e) {
                    return 0L;
                }
            })
            .sum();
    }

    public int getTotalItems() {
        return items.stream()
            .mapToInt(item -> {
                try {
                    return item.getDecryptedQuantity();
                } catch (Exception e) {
                    return 0;
                }
            })
            .sum();
    }

    // ===== GETTERS =====
    public User getUser() { return user; }
    public List<CartItem> getItems() { return items; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }

    // ===== SETTERS =====
    public void setUser(User user) { this.user = user; }
    public void setItems(List<CartItem> items) { this.items = items; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    // ===== GIẢI MÃ =====
public LocalDateTime getDecryptedCreatedAt() throws Exception {
    if (createdAt == null || createdAt.isEmpty()) return null;
    try {
        String dateStr = decryptField(createdAt, "cart");
        return dateStr != null ? LocalDateTime.parse(dateStr) : null;
    } catch (Exception e) {
        return null;
    }
}


public LocalDateTime getDecryptedUpdatedAt() throws Exception {
    if (updatedAt == null || updatedAt.isEmpty()) return null;
    try {
        String dateStr = decryptField(updatedAt, "cart");
        return dateStr != null ? LocalDateTime.parse(dateStr) : null;
    } catch (Exception e) {
        return null;
    }
}

}
