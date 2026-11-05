// src/main/java/com/shoppc/backendnosecurity/service/CartService.java
package com.shoppc.backendnosecurity.service;

import com.shoppc.backendnosecurity.model.Cart;
import com.shoppc.backendnosecurity.model.CartItem;
import com.shoppc.backendnosecurity.model.Product;
import com.shoppc.backendnosecurity.model.User;
import com.shoppc.backendnosecurity.repository.CartRepository;
import com.shoppc.backendnosecurity.repository.CartItemRepository;
import com.shoppc.backendnosecurity.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public Optional<Cart> getCartByUser(User user) {
        return cartRepository.findByUser(user);
    }
    

@Transactional
public Cart addToCart(User user, String productId, Integer quantity) throws Exception {
    Cart cart = cartRepository.findByUser(user)
        .orElseThrow(() -> new RuntimeException("Cart not found"));
    
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new RuntimeException("Product not found"));
    
    Optional<CartItem> existingItem = cart.getItems().stream()
        .filter(item -> item.getProduct().getId().equals(productId))
        .findFirst();
    
    if (existingItem.isPresent()) {
        CartItem item = existingItem.get();
        Integer newQuantity = item.getDecryptedQuantity() + quantity;
        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
    } else {
        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        newItem.setPrice(product.getDecryptedPrice());
        cart.getItems().add(newItem);
        cartItemRepository.save(newItem);
    }
    
    // ✅ Sửa: set updatedAt là String
    cart.setUpdatedAt(LocalDateTime.now().toString());
    return cartRepository.save(cart);
}

@Transactional
public Cart updateCartItem(User user, String itemId, Integer quantity) {
    Cart cart = cartRepository.findByUser(user)
        .orElseThrow(() -> new RuntimeException("Cart not found"));
    
    CartItem item = cartItemRepository.findById(itemId)
        .orElseThrow(() -> new RuntimeException("Item not found"));
    
    if (quantity <= 0) {
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
    } else {
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }
    
    // ✅ Sửa: set updatedAt là String
    cart.setUpdatedAt(LocalDateTime.now().toString());
    return cartRepository.save(cart);
}

@Transactional
public Cart removeCartItem(User user, String itemId) {
    Cart cart = cartRepository.findByUser(user)
        .orElseThrow(() -> new RuntimeException("Cart not found"));
    
    CartItem item = cartItemRepository.findById(itemId)
        .orElseThrow(() -> new RuntimeException("Item not found"));
    
    cart.getItems().remove(item);
    cartItemRepository.delete(item);
    
    // ✅ Sửa: set updatedAt là String
    cart.setUpdatedAt(LocalDateTime.now().toString());
    return cartRepository.save(cart);
}

@Transactional
public void clearCart(User user) {
    Cart cart = cartRepository.findByUser(user)
        .orElseThrow(() -> new RuntimeException("Cart not found"));
    cartItemRepository.deleteAll(cart.getItems());
    cart.getItems().clear();
    // ✅ Sửa: set updatedAt là String
    cart.setUpdatedAt(LocalDateTime.now().toString());
    cartRepository.save(cart);
}
}
