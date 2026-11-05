// src/main/java/com/shoppc/backendnosecurity/repository/CartItemRepository.java
package com.shoppc.backendnosecurity.repository;

import com.shoppc.backendnosecurity.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
}
