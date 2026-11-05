// src/main/java/com/shoppc/backendnosecurity/controller/AdminController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.model.Order;
import com.shoppc.backendnosecurity.model.OrderItem;
import com.shoppc.backendnosecurity.model.Product;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.service.OrderService;
import com.shoppc.backendnosecurity.service.ProductService;
import com.shoppc.backendnosecurity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserService userService;
    
    // ===== USER MANAGEMENT =====
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            
            List<Map<String, Object>> decryptedUsers = new ArrayList<>();
            for (User user : users) {
                Map<String, Object> result = new HashMap<>();
                result.put("id", user.getId());
                result.put("name", user.getDecryptedName());
                result.put("email", user.getDecryptedEmail());
                result.put("phone", user.getDecryptedPhone());
                result.put("address", user.getDecryptedAddress());
                result.put("avatar", user.getDecryptedAvatar());
                result.put("role", user.getDecryptedRole());
                result.put("createdAt", user.getDecryptedCreatedAt());
                result.put("updatedAt", user.getDecryptedUpdatedAt());
                result.put("signatureValid", user.isSignatureValid());
                decryptedUsers.add(result);
            }
            
            return ResponseEntity.ok(decryptedUsers);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            return userService.getUserById(id)
                .map(user -> {
                    try {
                        Map<String, Object> result = new HashMap<>();
                        result.put("id", user.getId());
                        result.put("name", user.getDecryptedName());
                        result.put("email", user.getDecryptedEmail());
                        result.put("phone", user.getDecryptedPhone());
                        result.put("address", user.getDecryptedAddress());
                        result.put("avatar", user.getDecryptedAvatar());
                        result.put("role", user.getDecryptedRole());
                        result.put("createdAt", user.getDecryptedCreatedAt());
                        result.put("updatedAt", user.getDecryptedUpdatedAt());
                        result.put("signatureValid", user.isSignatureValid());
                        return ResponseEntity.ok(result);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            User updated = userService.updateUser(id, user);
            if (updated != null) {
                Map<String, Object> result = new HashMap<>();
                result.put("id", updated.getId());
                result.put("name", updated.getDecryptedName());
                result.put("email", updated.getDecryptedEmail());
                result.put("role", updated.getDecryptedRole());
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // ===== ORDER MANAGEMENT =====
    @GetMapping("/orders")
public ResponseEntity<?> getAllOrders() {
    try {
        List<Order> orders = orderService.getAllOrders();
        
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

@GetMapping("/orders/pending")
public ResponseEntity<?> getPendingOrders() {
    try {
        List<Order> orders = orderService.getOrdersByStatus(Order.OrderStatus.PENDING);
        
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
// src/main/java/com/shoppc/backendnosecurity/controller/AdminController.java

@PutMapping("/orders/{orderId}/status")
public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, String> request) {
    try {
        String statusStr = request.get("status").toUpperCase();
        System.out.println("📋 Received status update: " + statusStr + " for order: " + orderId);
        
        Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr);
        Order order = orderService.updateOrderStatus(orderId, status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order status updated");
        response.put("order", decryptOrder(order));
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        System.err.println("❌ Error updating order status: " + e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
@PutMapping("/orders/{orderId}/payment")
public ResponseEntity<?> updatePaymentStatus(@PathVariable String orderId, @RequestBody Map<String, String> request) {
    try {
        String paymentStatusStr = request.get("paymentStatus").toUpperCase();
        Order.PaymentStatus paymentStatus = Order.PaymentStatus.valueOf(paymentStatusStr);
        
        // ✅ Kiểm tra order hiện tại
        Order existingOrder = orderService.getOrderById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        String currentStatus = existingOrder.getDecryptedStatus();
        
        // ✅ Nếu đã hủy thì không cho thay đổi
        if ("CANCELLED".equals(currentStatus)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Không thể thay đổi thanh toán của đơn hàng đã hủy");
            return ResponseEntity.badRequest().body(error);
        }
        
        Order order = orderService.updatePaymentStatus(orderId, paymentStatus);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment status updated");
        response.put("order", decryptOrder(order));
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
@PutMapping("/orders/{orderId}/cancel")
public ResponseEntity<?> cancelOrder(@PathVariable String orderId) {
    try {
        System.out.println("❌ Cancelling order: " + orderId);
        orderService.cancelOrder(orderId);
        
        // Lấy lại order sau khi hủy
        Order order = orderService.getOrderById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order cancelled successfully");
        response.put("order", decryptOrder(order));
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        System.err.println("❌ Error cancelling order: " + e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
    // ===== PRODUCT MANAGEMENT =====
    
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product created = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
        try {
            Product updated = productService.updateProduct(id, product);
            return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
private Map<String, Object> decryptOrder(Order order) {
    try {
        Map<String, Object> result = new HashMap<>();
        result.put("id", order.getId());
        result.put("orderCode", order.getDecryptedOrderCode());
        result.put("recipientName", order.getDecryptedRecipientName());
        result.put("phoneNumber", order.getDecryptedPhoneNumber());
        result.put("shippingAddress", order.getDecryptedShippingAddress());
        result.put("paymentMethod", order.getDecryptedPaymentMethod());
        result.put("paymentStatus", order.getDecryptedPaymentStatus());
        result.put("status", order.getDecryptedStatus());
        result.put("totalAmount", order.getDecryptedTotalAmount());
        result.put("note", order.getDecryptedNote());
        result.put("orderedAt", order.getDecryptedOrderedAt());
        result.put("updatedAt", order.getDecryptedUpdatedAt());
        result.put("deliveredAt", order.getDecryptedDeliveredAt());
        
        if (order.getItems() != null) {
            List<Map<String, Object>> decryptedItems = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("productName", item.getDecryptedProductName());
                itemMap.put("quantity", item.getDecryptedQuantity());
                itemMap.put("price", item.getDecryptedPrice());
                
                if (item.getProduct() != null) {
                    Map<String, Object> productMap = new HashMap<>();
                    productMap.put("id", item.getProduct().getId());
                    productMap.put("name", item.getProduct().getDecryptedName());
                    productMap.put("image", item.getProduct().getDecryptedImage());
                    productMap.put("brand", item.getProduct().getDecryptedBrand());
                    productMap.put("discount", item.getProduct().getDecryptedDiscount());
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
        errorResult.put("error", "Decryption failed");
        return errorResult;
    }
}

}
