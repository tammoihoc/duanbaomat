// src/main/java/com/shoppc/backendnosecurity/model/OrderItem.java
package com.shoppc.backendnosecurity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name", columnDefinition = "TEXT")
    private String productName;

    @Column(columnDefinition = "TEXT")
    private String quantity;

    @Column(columnDefinition = "TEXT")
    private String price;

// src/main/java/com/shoppc/backendnosecurity/model/OrderItem.java

@PrePersist
protected void onCreate() throws Exception {
    // ✅ CHỈ mã hóa nếu dữ liệu chưa được mã hóa
    if (productName != null && !productName.isEmpty()) {
        try {
            // Thử giải mã - nếu thành công thì đã mã hóa, bỏ qua
            decryptField(productName, "order");
        } catch (Exception e) {
            // Chưa mã hóa → tiến hành mã hóa
            this.productName = encryptField(productName, "order");
        }
    }
}

    @PreUpdate
    protected void onUpdate() throws Exception {
        if (productName != null && !productName.isEmpty()) {
            this.productName = encryptField(productName, "order");
        }
        if (quantity != null && !quantity.isEmpty()) {
            this.quantity = encryptField(quantity, "order");
        }
        if (price != null && !price.isEmpty()) {
            this.price = encryptField(price, "order");
        }
    }

    // ===== GETTERS =====
    public Order getOrder() { return order; }
    public Product getProduct() { return product; }
    public String getProductName() { return productName; }
    public String getQuantity() { return quantity; }
    public String getPrice() { return price; }

    // ===== SETTERS =====
    public void setOrder(Order order) { this.order = order; }
    public void setProduct(Product product) { this.product = product; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public void setPrice(String price) { this.price = price; }

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

    // ===== PHƯƠNG THỨC GIẢI MÃ =====
    public String getDecryptedProductName() throws Exception {
        if (productName == null || productName.isEmpty()) return "";
        try {
            if (!productName.matches("^[A-Za-z0-9+/=]+$")) {
                return productName;
            }
            return decryptField(productName, "order");
        } catch (Exception e) {
            return productName;
        }
    }


// ===== GIẢI MÃ =====

public Integer getDecryptedQuantity() throws Exception {
    if (quantity == null || quantity.isEmpty()) {
        System.out.println("⚠️ Quantity is null or empty, returning 0");
        return 0;
    }
    
    System.out.println("🔐 Decrypting quantity: " + quantity);
    
    // ✅ Nếu đã là số (plain text) - parse trực tiếp
    if (quantity.matches("^\\d+$")) {
        System.out.println("✅ Quantity is plain number: " + quantity);
        return Integer.parseInt(quantity);
    }
    
    // ✅ Nếu là Base64 (đã mã hóa)
    try {
        String decrypted = decryptField(quantity, "order");
        System.out.println("✅ Decrypted quantity: " + decrypted);
        if (decrypted != null && decrypted.matches("^\\d+$")) {
            return Integer.parseInt(decrypted);
        }
        return 0;
    } catch (Exception e) {
        System.err.println("❌ Failed to decrypt quantity: " + e.getMessage());
        // Thử parse trực tiếp từ dữ liệu thô
        try {
            return Integer.parseInt(quantity);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}

public Long getDecryptedPrice() throws Exception {
    if (price == null || price.isEmpty()) {
        System.out.println("⚠️ Price is null or empty, returning 0");
        return 0L;
    }
    
    System.out.println("🔐 Decrypting price: " + price);
    
    // ✅ Nếu đã là số (plain text)
    if (price.matches("^\\d+$")) {
        System.out.println("✅ Price is plain number: " + price);
        return Long.parseLong(price);
    }
    
    // ✅ Nếu là Base64 (đã mã hóa)
    try {
        String decrypted = decryptField(price, "order");
        System.out.println("✅ Decrypted price: " + decrypted);
        if (decrypted != null && decrypted.matches("^\\d+$")) {
            return Long.parseLong(decrypted);
        }
        return 0L;
    } catch (Exception e) {
        System.err.println("❌ Failed to decrypt price: " + e.getMessage());
        try {
            return Long.parseLong(price);
        } catch (NumberFormatException ex) {
            return 0L;
        }
    }
}
}
