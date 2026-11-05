package com.shoppc.backendnosecurity.dto;

public class OrderRequest {
    private String paymentMethod;
    private String recipientName;
    private String phoneNumber;
    private String shippingAddress;
    private String note;
    
    // ===== GETTERS =====
    public String getPaymentMethod() { return paymentMethod; }
    public String getRecipientName() { return recipientName; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getShippingAddress() { return shippingAddress; }
    public String getNote() { return note; }
    
    // ===== SETTERS =====
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public void setNote(String note) { this.note = note; }
}
