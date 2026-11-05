// src/main/java/com/shoppc/backendnosecurity/controller/CartController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.model.Cart;
import com.shoppc.backendnosecurity.model.CartItem;
import com.shoppc.backendnosecurity.model.Product;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.service.CartService;
import com.shoppc.backendnosecurity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable String userId) {
        try {
            System.out.println("🛒 Getting cart for user: " + userId);
            
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Cart cart = cartService.getCartByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
            
            // ✅ Tạo response với dữ liệu đã giải mã
            Map<String, Object> response = new HashMap<>();
            response.put("id", cart.getId());
            
            // ✅ Giải mã totalItems và totalPrice
            try {
                response.put("totalItems", cart.getTotalItems());
                response.put("totalPrice", cart.getTotalPrice());
            } catch (Exception e) {
                System.err.println("⚠️ Error calculating cart totals: " + e.getMessage());
                response.put("totalItems", 0);
                response.put("totalPrice", 0);
            }
            
            // ✅ Giải mã createdAt và updatedAt
            try {
                response.put("createdAt", cart.getDecryptedCreatedAt());
                response.put("updatedAt", cart.getDecryptedUpdatedAt());
            } catch (Exception e) {
                response.put("createdAt", cart.getCreatedAt());
                response.put("updatedAt", cart.getUpdatedAt());
            }
            
            // ✅ Giải mã từng item
            java.util.List<Map<String, Object>> decryptedItems = new java.util.ArrayList<>();
            for (CartItem item : cart.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                
                // ✅ Giải mã quantity
                try {
                    itemMap.put("quantity", item.getDecryptedQuantity());
                } catch (Exception e) {
                    System.err.println("⚠️ Error decrypting quantity: " + e.getMessage());
                    itemMap.put("quantity", 0);
                    itemMap.put("quantity_error", "Decryption failed");
                }
                
                // ✅ Giải mã price
                try {
                    itemMap.put("price", item.getDecryptedPrice());
                } catch (Exception e) {
                    System.err.println("⚠️ Error decrypting price: " + e.getMessage());
                    itemMap.put("price", 0);
                    itemMap.put("price_error", "Decryption failed");
                }
                
                // ✅ Giải mã addedAt
                try {
                    itemMap.put("addedAt", item.getDecryptedAddedAt());
                } catch (Exception e) {
                    itemMap.put("addedAt", item.getAddedAt());
                }
                
                // ✅ Giải mã product
                Product product = item.getProduct();
                if (product != null) {
                    Map<String, Object> productMap = new HashMap<>();
                    try {
                        productMap.put("id", product.getId());
                        productMap.put("name", product.getDecryptedName());
                        productMap.put("brand", product.getDecryptedBrand());
                        productMap.put("image", product.getDecryptedImage());
                        productMap.put("price", product.getDecryptedPrice());
                        productMap.put("salePrice", product.getDecryptedSalePrice());
                        productMap.put("discount", product.getDecryptedDiscount());
                        productMap.put("stock", product.getDecryptedStock());
                    } catch (Exception e) {
                        System.err.println("⚠️ Error decrypting product: " + e.getMessage());
                        productMap.put("id", product.getId());
                        productMap.put("name", "Sản phẩm");
                        productMap.put("brand", "");
                        productMap.put("image", "");
                        productMap.put("price", 0);
                        productMap.put("salePrice", 0);
                        productMap.put("discount", 0);
                        productMap.put("stock", 0);
                    }
                    itemMap.put("product", productMap);
                }
                decryptedItems.add(itemMap);
            }
            response.put("items", decryptedItems);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting cart: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        try {
            String userId = request.get("userId").toString();
            String productId = request.get("productId").toString();
            Integer quantity = (Integer) request.get("quantity");
            
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Cart cart = cartService.addToCart(user, productId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Added to cart successfully");
            response.put("cart", cart);
            response.put("totalItems", cart.getTotalItems());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestBody Map<String, Object> request) {
        try {
            String userId = request.get("userId").toString();
            String itemId = request.get("itemId").toString();
            Integer quantity = (Integer) request.get("quantity");
            
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Cart cart = cartService.updateCartItem(user, itemId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            response.put("totalItems", cart.getTotalItems());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/remove/{userId}/{itemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable String userId, @PathVariable String itemId) {
        try {
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Cart cart = cartService.removeCartItem(user, itemId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            response.put("totalItems", cart.getTotalItems());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            cartService.clearCart(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart cleared");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
