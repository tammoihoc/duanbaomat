// src/main/java/com/shoppc/backendnosecurity/model/Order.java
package com.shoppc.backendnosecurity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String orderCode;  // ✅ Mã hóa

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String totalAmount;  // ✅ Mã hóa (chuyển từ Long sang String)

    @Column(columnDefinition = "TEXT")
    private String status;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String paymentMethod;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String paymentStatus;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String recipientName;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String phoneNumber;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String shippingAddress;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String note;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String orderedAt;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String updatedAt;  // ✅ Mã hóa

    @Column(columnDefinition = "TEXT")
    private String deliveredAt;  // ✅ Mã hóa

    // Enum để dùng trong code, không lưu trực tiếp vào database
    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
    }

    public enum PaymentMethod {
        BANK_TRANSFER, CASH
    }

    public enum PaymentStatus {
        UNPAID, PAID
    }

    @PrePersist
    protected void onCreate() throws Exception {
        this.orderedAt = encryptField(LocalDateTime.now().toString(), "order");
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "order");
        if (orderCode == null || orderCode.isEmpty()) {
            this.orderCode = encryptField("ORD" + System.currentTimeMillis(), "order");
        }
        // Set default values
        if (status == null || status.isEmpty()) {
            this.status = encryptField("PENDING", "order");
        }
        if (paymentStatus == null || paymentStatus.isEmpty()) {
            this.paymentStatus = encryptField("UNPAID", "order");
        }
        encryptFields();
        signData(getDataToSign());
    }

    @PreUpdate
    protected void onUpdate() throws Exception {
        System.out.println("📦 Order @PreUpdate triggered for ID: " + getId());
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "order");
        
        // Nếu trạng thái là DELIVERED và chưa có deliveredAt
        String decryptedStatus = getDecryptedStatus();
        if ("DELIVERED".equals(decryptedStatus) && (deliveredAt == null || deliveredAt.isEmpty())) {
            this.deliveredAt = encryptField(LocalDateTime.now().toString(), "order");
        }
        
        encryptFields();
        signData(getDataToSign());
        System.out.println("✅ Order @PreUpdate completed");
    }

    private void encryptFields() throws Exception {
        // Mã hóa từng trường nếu chưa được mã hóa
        if (orderCode != null && !orderCode.isEmpty()) {
            try { decryptField(orderCode, "order"); } catch (Exception e) {
                this.orderCode = encryptField(orderCode, "order");
            }
        }
        if (totalAmount != null && !totalAmount.isEmpty()) {
            try { decryptField(totalAmount, "order"); } catch (Exception e) {
                this.totalAmount = encryptField(totalAmount, "order");
            }
        }
        if (status != null && !status.isEmpty()) {
            try { decryptField(status, "order"); } catch (Exception e) {
                this.status = encryptField(status, "order");
            }
        }
        if (paymentMethod != null && !paymentMethod.isEmpty()) {
            try { decryptField(paymentMethod, "order"); } catch (Exception e) {
                this.paymentMethod = encryptField(paymentMethod, "order");
            }
        }
        if (paymentStatus != null && !paymentStatus.isEmpty()) {
            try { decryptField(paymentStatus, "order"); } catch (Exception e) {
                this.paymentStatus = encryptField(paymentStatus, "order");
            }
        }
        if (recipientName != null && !recipientName.isEmpty()) {
            try { decryptField(recipientName, "order"); } catch (Exception e) {
                this.recipientName = encryptField(recipientName, "order");
            }
        }
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            try { decryptField(phoneNumber, "order"); } catch (Exception e) {
                this.phoneNumber = encryptField(phoneNumber, "order");
            }
        }
        if (shippingAddress != null && !shippingAddress.isEmpty()) {
            try { decryptField(shippingAddress, "order"); } catch (Exception e) {
                this.shippingAddress = encryptField(shippingAddress, "order");
            }
        }
        if (note != null && !note.isEmpty()) {
            try { decryptField(note, "order"); } catch (Exception e) {
                this.note = encryptField(note, "order");
            }
        }
    }

    private String getDataToSign() {
        String data = "";
        data += (getId() != null ? getId() : "");
        data += (orderCode != null ? orderCode : "");
        data += (recipientName != null ? recipientName : "");
        data += (phoneNumber != null ? phoneNumber : "");
        data += (shippingAddress != null ? shippingAddress : "");
        data += (totalAmount != null ? totalAmount : "");
        return data;
    }

    // ===== GETTERS (trả về dữ liệu đã mã hóa) =====
    public String getOrderCode() { return orderCode; }
    public User getUser() { return user; }
    public List<OrderItem> getItems() { return items; }
    public String getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public String getRecipientName() { return recipientName; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getShippingAddress() { return shippingAddress; }
    public String getNote() { return note; }
    public String getOrderedAt() { return orderedAt; }
    public String getUpdatedAt() { return updatedAt; }
    public String getDeliveredAt() { return deliveredAt; }

    // ===== SETTERS (nhận plain text, sẽ mã hóa khi lưu) =====
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public void setUser(User user) { this.user = user; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public void setTotalAmount(String totalAmount) { this.totalAmount = totalAmount; }
    public void setStatus(String status) { this.status = status; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public void setNote(String note) { this.note = note; }
    public void setOrderedAt(String orderedAt) { this.orderedAt = orderedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    public void setDeliveredAt(String deliveredAt) { this.deliveredAt = deliveredAt; }

    // ===== SETTERS CHO SỐ VÀ ENUM =====
    public void setTotalAmount(Long totalAmount) {
        if (totalAmount != null) {
            this.totalAmount = totalAmount.toString();
        }
    }

    public void setStatus(OrderStatus status) {
        if (status != null) {
            this.status = status.toString();
        }
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        if (paymentMethod != null) {
            this.paymentMethod = paymentMethod.toString();
        }
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        if (paymentStatus != null) {
            this.paymentStatus = paymentStatus.toString();
        }
    }

    // ===== PHƯƠNG THỨC GIẢI MÃ =====
    public String getDecryptedOrderCode() throws Exception {
        if (orderCode == null || orderCode.isEmpty()) return "";
        try {
            if (!orderCode.matches("^[A-Za-z0-9+/=]+$")) {
                return orderCode;
            }
            return decryptField(orderCode, "order");
        } catch (Exception e) {
            return orderCode;
        }
    }

    public Long getDecryptedTotalAmount() throws Exception {
        if (totalAmount == null || totalAmount.isEmpty()) return 0L;
        try {
            String val = decryptField(totalAmount, "order");
            return val != null ? Long.parseLong(val) : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public String getDecryptedStatus() throws Exception {
        if (status == null || status.isEmpty()) return "PENDING";
        try {
            if (!status.matches("^[A-Za-z0-9+/=]+$")) {
                return status;
            }
            return decryptField(status, "order");
        } catch (Exception e) {
            return status;
        }
    }

    public String getDecryptedPaymentMethod() throws Exception {
        if (paymentMethod == null || paymentMethod.isEmpty()) return "CASH";
        try {
            if (!paymentMethod.matches("^[A-Za-z0-9+/=]+$")) {
                return paymentMethod;
            }
            return decryptField(paymentMethod, "order");
        } catch (Exception e) {
            return paymentMethod;
        }
    }

    public String getDecryptedPaymentStatus() throws Exception {
        if (paymentStatus == null || paymentStatus.isEmpty()) return "UNPAID";
        try {
            if (!paymentStatus.matches("^[A-Za-z0-9+/=]+$")) {
                return paymentStatus;
            }
            return decryptField(paymentStatus, "order");
        } catch (Exception e) {
            return paymentStatus;
        }
    }

    public String getDecryptedRecipientName() throws Exception {
        if (recipientName == null || recipientName.isEmpty()) return "";
        try {
            if (!recipientName.matches("^[A-Za-z0-9+/=]+$")) {
                return recipientName;
            }
            return decryptField(recipientName, "order");
        } catch (Exception e) {
            return recipientName;
        }
    }

    public String getDecryptedPhoneNumber() throws Exception {
        if (phoneNumber == null || phoneNumber.isEmpty()) return "";
        try {
            if (!phoneNumber.matches("^[A-Za-z0-9+/=]+$")) {
                return phoneNumber;
            }
            return decryptField(phoneNumber, "order");
        } catch (Exception e) {
            return phoneNumber;
        }
    }

    public String getDecryptedShippingAddress() throws Exception {
        if (shippingAddress == null || shippingAddress.isEmpty()) return "";
        try {
            if (!shippingAddress.matches("^[A-Za-z0-9+/=]+$")) {
                return shippingAddress;
            }
            return decryptField(shippingAddress, "order");
        } catch (Exception e) {
            return shippingAddress;
        }
    }

    public String getDecryptedNote() throws Exception {
        if (note == null || note.isEmpty()) return "";
        try {
            if (!note.matches("^[A-Za-z0-9+/=]+$")) {
                return note;
            }
            return decryptField(note, "order");
        } catch (Exception e) {
            return note;
        }
    }

    public LocalDateTime getDecryptedOrderedAt() throws Exception {
        if (orderedAt == null || orderedAt.isEmpty()) return null;
        try {
            String dateStr = decryptField(orderedAt, "order");
            return dateStr != null ? LocalDateTime.parse(dateStr) : null;
        } catch (Exception e) {
            return null;
        }
    }

    public LocalDateTime getDecryptedUpdatedAt() throws Exception {
        if (updatedAt == null || updatedAt.isEmpty()) return null;
        try {
            String dateStr = decryptField(updatedAt, "order");
            return dateStr != null ? LocalDateTime.parse(dateStr) : null;
        } catch (Exception e) {
            return null;
        }
    }

    public LocalDateTime getDecryptedDeliveredAt() throws Exception {
        if (deliveredAt == null || deliveredAt.isEmpty()) return null;
        try {
            String dateStr = decryptField(deliveredAt, "order");
            return dateStr != null ? LocalDateTime.parse(dateStr) : null;
        } catch (Exception e) {
            return null;
        }
    }
}
