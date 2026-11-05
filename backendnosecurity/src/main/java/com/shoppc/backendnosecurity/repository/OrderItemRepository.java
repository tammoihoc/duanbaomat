// OrderItemRepository.java
package com.shoppc.backendnosecurity.repository;

import com.shoppc.backendnosecurity.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {  // ✅ String
}
