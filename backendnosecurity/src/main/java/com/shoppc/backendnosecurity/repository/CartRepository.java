// src/main/java/com/shoppc/backendnosecurity/repository/CartRepository.java
package com.shoppc.backendnosecurity.repository;

import com.shoppc.backendnosecurity.model.Cart;
import com.shoppc.backendnosecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByUser(User user);
}
