// src/main/java/com/shoppc/backendnosecurity/controller/OrderController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.dto.OrderRequest;
import com.shoppc.backendnosecurity.model.Order;
import com.shoppc.backendnosecurity.model.OrderItem;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.service.OrderService;
import com.shoppc.backendnosecurity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Order> orders = orderService.getOrdersByUser(user);
            
            // ✅ Giải mã từng order
            List<Map<String, Object>> decryptedOrders = new ArrayList<>();
            for (Order order : orders) {
                Map<String, Object> orderMap = decryptOrder(order);
                decryptedOrders.add(orderMap);
            }
            
            return ResponseEntity.ok(decryptedOrders);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable String orderId) {
        try {
            return orderService.getOrderById(orderId)
                .map(order -> ResponseEntity.ok(decryptOrder(order)))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> request) {
        try {
            String userId = request.get("userId").toString();
            
            OrderRequest orderRequest = new OrderRequest();
            orderRequest.setPaymentMethod((String) request.get("paymentMethod"));
            orderRequest.setRecipientName((String) request.get("recipientName"));
            orderRequest.setPhoneNumber((String) request.get("phoneNumber"));
            orderRequest.setShippingAddress((String) request.get("shippingAddress"));
            orderRequest.setNote((String) request.get("note"));
            
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Order order = orderService.createOrder(user, orderRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully");
            response.put("order", decryptOrder(order));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // ===== PHƯƠNG THỨC GIẢI MÃ ORDER =====
    private Map<String, Object> decryptOrder(Order order) {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // ID - không giải mã
            result.put("id", order.getId());
            
            // ✅ Giải mã tất cả các trường
            try {
                result.put("orderCode", order.getDecryptedOrderCode() != null ? order.getDecryptedOrderCode() : order.getOrderCode());
            } catch (Exception e) {
                result.put("orderCode", order.getOrderCode());
                result.put("orderCode_error", "Decryption failed");
            }
            
            try {
                result.put("recipientName", order.getDecryptedRecipientName() != null ? order.getDecryptedRecipientName() : order.getRecipientName());
            } catch (Exception e) {
                result.put("recipientName", order.getRecipientName());
                result.put("recipientName_error", "Decryption failed");
            }
            
            try {
                result.put("phoneNumber", order.getDecryptedPhoneNumber() != null ? order.getDecryptedPhoneNumber() : order.getPhoneNumber());
            } catch (Exception e) {
                result.put("phoneNumber", order.getPhoneNumber());
                result.put("phoneNumber_error", "Decryption failed");
            }
            
            try {
                result.put("shippingAddress", order.getDecryptedShippingAddress() != null ? order.getDecryptedShippingAddress() : order.getShippingAddress());
            } catch (Exception e) {
                result.put("shippingAddress", order.getShippingAddress());
                result.put("shippingAddress_error", "Decryption failed");
            }
            
            try {
                result.put("paymentMethod", order.getDecryptedPaymentMethod() != null ? order.getDecryptedPaymentMethod() : order.getPaymentMethod());
            } catch (Exception e) {
                result.put("paymentMethod", order.getPaymentMethod());
                result.put("paymentMethod_error", "Decryption failed");
            }
            
            try {
                result.put("paymentStatus", order.getDecryptedPaymentStatus() != null ? order.getDecryptedPaymentStatus() : order.getPaymentStatus());
            } catch (Exception e) {
                result.put("paymentStatus", order.getPaymentStatus());
                result.put("paymentStatus_error", "Decryption failed");
            }
            
            try {
                result.put("status", order.getDecryptedStatus() != null ? order.getDecryptedStatus() : order.getStatus());
            } catch (Exception e) {
                result.put("status", order.getStatus());
                result.put("status_error", "Decryption failed");
            }
            
            try {
                result.put("totalAmount", order.getDecryptedTotalAmount() != null ? order.getDecryptedTotalAmount() : order.getTotalAmount());
            } catch (Exception e) {
                result.put("totalAmount", order.getTotalAmount());
                result.put("totalAmount_error", "Decryption failed");
            }
            
            try {
                result.put("note", order.getDecryptedNote() != null ? order.getDecryptedNote() : order.getNote());
            } catch (Exception e) {
                result.put("note", order.getNote());
                result.put("note_error", "Decryption failed");
            }
            
            try {
                result.put("orderedAt", order.getDecryptedOrderedAt() != null ? order.getDecryptedOrderedAt().toString() : order.getOrderedAt());
            } catch (Exception e) {
                result.put("orderedAt", order.getOrderedAt());
                result.put("orderedAt_error", "Decryption failed");
            }
            
            try {
                result.put("updatedAt", order.getDecryptedUpdatedAt() != null ? order.getDecryptedUpdatedAt().toString() : order.getUpdatedAt());
            } catch (Exception e) {
                result.put("updatedAt", order.getUpdatedAt());
                result.put("updatedAt_error", "Decryption failed");
            }
            
            try {
                result.put("deliveredAt", order.getDecryptedDeliveredAt() != null ? order.getDecryptedDeliveredAt().toString() : order.getDeliveredAt());
            } catch (Exception e) {
                result.put("deliveredAt", order.getDeliveredAt());
                result.put("deliveredAt_error", "Decryption failed");
            }
            
            // ✅ Giải mã items
if (order.getItems() != null) {
    List<Map<String, Object>> decryptedItems = new ArrayList<>();
    for (OrderItem item : order.getItems()) {
        Map<String, Object> itemMap = new HashMap<>();
        itemMap.put("id", item.getId());
        
        // ✅ Giải mã productName
        try {
            itemMap.put("productName", item.getDecryptedProductName());
        } catch (Exception e) {
            itemMap.put("productName", item.getProductName());
            itemMap.put("productName_error", "Decryption failed");
        }
        
        // ✅ Giải mã quantity
        try {
            itemMap.put("quantity", item.getDecryptedQuantity());
        } catch (Exception e) {
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("quantity_error", "Decryption failed");
        }
        
        // ✅ Giải mã price
        try {
            itemMap.put("price", item.getDecryptedPrice());
        } catch (Exception e) {
            itemMap.put("price", item.getPrice());
            itemMap.put("price_error", "Decryption failed");
        }
        
        if (item.getProduct() != null) {
            Map<String, Object> productMap = new HashMap<>();
            try {
                productMap.put("id", item.getProduct().getId());
                productMap.put("name", item.getProduct().getDecryptedName());
                productMap.put("image", item.getProduct().getDecryptedImage());
                productMap.put("brand", item.getProduct().getDecryptedBrand());
                productMap.put("discount", item.getProduct().getDecryptedDiscount());
            } catch (Exception e) {
                productMap.put("id", item.getProduct().getId());
                productMap.put("name", "Sản phẩm");
                productMap.put("image", "");
                productMap.put("brand", "");
                productMap.put("discount", 0);
            }
            itemMap.put("product", productMap);
        }
        decryptedItems.add(itemMap);
    }
    result.put("items", decryptedItems);
}
            
            return result;
        } catch (Exception e) {
            System.err.println("❌ Error decrypting order: " + e.getMessage());
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("id", order.getId());
            errorResult.put("error", "Decryption failed: " + e.getMessage());
            return errorResult;
        }
    }
}
