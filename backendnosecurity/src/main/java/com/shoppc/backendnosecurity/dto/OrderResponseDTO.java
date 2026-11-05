// src/main/java/com/shoppc/backendnosecurity/dto/OrderResponseDTO.java
package com.shoppc.backendnosecurity.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private Long id;
    private String orderCode;
    private String recipientName;
    private String phoneNumber;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
    private String status;
    private Long totalAmount;
    private String note;
    private LocalDateTime orderedAt;
    private LocalDateTime deliveredAt;
    private List<OrderItemDTO> items;
    
    // GETTERS & SETTERS
}


