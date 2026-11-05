// src/main/java/com/shoppc/backendnosecurity/repository/OrderRepository.java
package com.shoppc.backendnosecurity.repository;

import com.shoppc.backendnosecurity.model.Order;
import com.shoppc.backendnosecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserOrderByOrderedAtDesc(User user);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByPaymentStatus(Order.PaymentStatus paymentStatus);
    List<Order> findByStatusAndPaymentStatus(Order.OrderStatus status, Order.PaymentStatus paymentStatus);
}
