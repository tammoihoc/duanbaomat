// src/main/java/com/shoppc/backendnosecurity/model/CartItem.java
package com.shoppc.backendnosecurity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
public class CartItem extends BaseEntity {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(columnDefinition = "TEXT")
    private String quantity;

    @Column(columnDefinition = "TEXT")
    private String price;

    @Column(columnDefinition = "TEXT")
    private String addedAt;

    @PrePersist
    protected void onCreate() throws Exception {
        this.addedAt = encryptField(LocalDateTime.now().toString(), "cart");
        if (quantity != null && !quantity.isEmpty()) {
            // Kiểm tra nếu chưa mã hóa thì mã hóa
            try {
                decryptField(quantity, "cart");
            } catch (Exception e) {
                this.quantity = encryptField(quantity, "cart");
            }
        }
        if (price != null && !price.isEmpty()) {
            try {
                decryptField(price, "cart");
            } catch (Exception e) {
                this.price = encryptField(price, "cart");
            }
        }
    }

    @PreUpdate
    protected void onUpdate() throws Exception {
        if (quantity != null && !quantity.isEmpty()) {
            try {
                decryptField(quantity, "cart");
            } catch (Exception e) {
                this.quantity = encryptField(quantity, "cart");
            }
        }
        if (price != null && !price.isEmpty()) {
            try {
                decryptField(price, "cart");
            } catch (Exception e) {
                this.price = encryptField(price, "cart");
            }
        }
    }

    // ===== GETTERS =====
    public Cart getCart() { return cart; }
    public Product getProduct() { return product; }
    public String getQuantity() { return quantity; }
    public String getPrice() { return price; }
    public String getAddedAt() { return addedAt; }

    // ===== SETTERS =====
    public void setCart(Cart cart) { this.cart = cart; }
    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public void setPrice(String price) { this.price = price; }
    public void setAddedAt(String addedAt) { this.addedAt = addedAt; }

    // ===== SETTERS CHO SỐ =====
    public void setQuantity(Integer quantity) {
        if (quantity != null) {
            this.quantity = quantity.toString();
        }
    }

    public void setPrice(Long price) {
        if (price != null) {
            this.price = price.toString();
        }
    }

    // ===== GIẢI MÃ =====
public Integer getDecryptedQuantity() throws Exception {
    if (quantity == null || quantity.isEmpty()) return 0;
    try {
        if (quantity.matches("^\\d+$")) {
            return Integer.parseInt(quantity);
        }
        String val = decryptField(quantity, "cart");
        return val != null ? Integer.parseInt(val) : 0;
    } catch (Exception e) {
        return 0;
    }
}

public Long getDecryptedPrice() throws Exception {
    if (price == null || price.isEmpty()) return 0L;
    try {
        if (price.matches("^\\d+$")) {
            return Long.parseLong(price);
        }
        String val = decryptField(price, "cart");
        return val != null ? Long.parseLong(val) : 0L;
    } catch (Exception e) {
        return 0L;
    }
}

public LocalDateTime getDecryptedAddedAt() throws Exception {
    if (addedAt == null || addedAt.isEmpty()) return null;
    try {
        String dateStr = decryptField(addedAt, "cart");
        return dateStr != null ? LocalDateTime.parse(dateStr) : null;
    } catch (Exception e) {
        return null;
    }
}
}
