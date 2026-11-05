// src/main/java/com/shoppc/backendnosecurity/service/OrderService.java
package com.shoppc.backendnosecurity.service;

import com.shoppc.backendnosecurity.dto.OrderRequest;
import com.shoppc.backendnosecurity.model.*;
import com.shoppc.backendnosecurity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Order> getOrdersByUser(User user) {
        List<Order> orders = orderRepository.findByUserOrderByOrderedAtDesc(user);
        
        // ✅ Giải mã dữ liệu cho từng order
        for (Order order : orders) {
            try {
                // Giải mã các trường
                order.setRecipientName(order.getDecryptedRecipientName());
                order.setPhoneNumber(order.getDecryptedPhoneNumber());
                order.setShippingAddress(order.getDecryptedShippingAddress());
                order.setNote(order.getDecryptedNote());
                
                // Giải mã items
                for (OrderItem item : order.getItems()) {
                    item.setProductName(item.getDecryptedProductName());
                }
            } catch (Exception e) {
                System.err.println("❌ Error decrypting order: " + e.getMessage());
            }
        }
        
        return orders;
    }
    
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    } 
    
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    public List<Order> getOrdersByPaymentStatus(Order.PaymentStatus paymentStatus) {
        return orderRepository.findByPaymentStatus(paymentStatus);
    }
@Transactional
public Order createOrder(User user, OrderRequest request) throws Exception {
    Cart cart = cartRepository.findByUser(user)
        .orElseThrow(() -> new RuntimeException("Cart not found"));
    
    if (cart.getItems().isEmpty()) {
        throw new RuntimeException("Cart is empty");
    }
    
    Order.PaymentMethod paymentMethod;
    try {
        paymentMethod = Order.PaymentMethod.valueOf(request.getPaymentMethod());
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Invalid payment method");
    }
    
    Order order = new Order();
    order.setUser(user);
    order.setPaymentMethod(paymentMethod);
    order.setRecipientName(request.getRecipientName());
    order.setPhoneNumber(request.getPhoneNumber());
    order.setShippingAddress(request.getShippingAddress());
    order.setNote(request.getNote());
    order.setStatus(Order.OrderStatus.PENDING);
    order.setOrderedAt(LocalDateTime.now().toString());
    order.setUpdatedAt(LocalDateTime.now().toString());
    
    Long totalAmount = 0L;
    
    for (CartItem cartItem : cart.getItems()) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(cartItem.getProduct());
        
        String productName = cartItem.getProduct().getDecryptedName();
        orderItem.setProductName(productName);
        
        Integer quantity = cartItem.getDecryptedQuantity();
        orderItem.setQuantity(quantity);
        
        Long originalPrice = cartItem.getDecryptedPrice();
        Integer discount = cartItem.getProduct().getDecryptedDiscount();
        Long finalPrice = originalPrice;
        if (discount != null && discount > 0) {
            finalPrice = originalPrice - (originalPrice * discount / 100);
        }
        orderItem.setPrice(finalPrice);
        
        orderItemRepository.save(orderItem);
        totalAmount += finalPrice * quantity;
        
        // ✅ CẬP NHẬT SẢN PHẨM
        Product product = cartItem.getProduct();
        Integer currentStock = product.getDecryptedStock();
        Integer currentSoldCount = product.getDecryptedSoldCount();
        
        // Giảm stock
        product.setStock(String.valueOf(currentStock - quantity));
        // ✅ Tăng soldCount (số lượng đã bán)
        product.setSoldCount(String.valueOf(currentSoldCount + quantity));
        
        productRepository.save(product);
        
        System.out.println("📦 Updated product:");
        System.out.println("   New stock: " + (currentStock - quantity));
        System.out.println("   New soldCount: " + (currentSoldCount + quantity));
    }
    
    order.setTotalAmount(totalAmount);
    Order savedOrder = orderRepository.save(order);
    
    cart.getItems().clear();
    cartRepository.save(cart);
    
    return savedOrder;
}
    

// src/main/java/com/shoppc/backendnosecurity/service/OrderService.java

// src/main/java/com/shoppc/backendnosecurity/service/OrderService.java

@Transactional
public Order updateOrderStatus(String orderId, Order.OrderStatus status) {
    return orderRepository.findById(orderId).map(order -> {
        try {
            String currentStatus = order.getDecryptedStatus();
            String newStatus = status.toString();
            
            System.out.println("📦 Updating order status: " + currentStatus + " → " + newStatus);
            
            // ✅ Nếu chuyển sang CANCELLED và chưa phải CANCELLED
if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(currentStatus)) {
    System.out.println("❌ Order is being cancelled. Restoring stock...");
    
    for (OrderItem item : order.getItems()) {
        Product product = item.getProduct();
        if (product != null) {
            Integer quantity = item.getDecryptedQuantity();
            
            // ✅ Hoàn lại stock
            Integer currentStock = product.getDecryptedStock();
            Integer newStock = currentStock + quantity;
            product.setStock(String.valueOf(newStock));
            
            // ✅ Giảm soldCount
            Integer currentSoldCount = product.getDecryptedSoldCount();
            Integer newSoldCount = currentSoldCount - quantity;
            if (newSoldCount < 0) {
                newSoldCount = 0;  // Không để số âm
            }
            product.setSoldCount(String.valueOf(newSoldCount));
            
            System.out.println("   Product: " + product.getDecryptedName());
            System.out.println("   Quantity: " + quantity);
            System.out.println("   Stock: " + currentStock + " → " + newStock);
            System.out.println("   SoldCount: " + currentSoldCount + " → " + newSoldCount);
            
            productRepository.save(product);
        }
    }
}
            
            // ✅ Không cho phép chuyển từ CANCELLED sang trạng thái khác
            if ("CANCELLED".equals(currentStatus) && !"CANCELLED".equals(newStatus)) {
                throw new RuntimeException("Không thể thay đổi trạng thái của đơn hàng đã hủy");
            }
            
            // Cập nhật trạng thái
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now().toString());
            
            if (status == Order.OrderStatus.DELIVERED) {
                order.setDeliveredAt(LocalDateTime.now().toString());
            }
            
            Order savedOrder = orderRepository.save(order);
            System.out.println("✅ Order status updated to: " + status);
            return savedOrder;
            
        } catch (Exception e) {
            System.err.println("❌ Error updating order status: " + e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }).orElseThrow(() -> new RuntimeException("Order not found"));
}
@Transactional
public Order updatePaymentStatus(String orderId, Order.PaymentStatus paymentStatus) {
    return orderRepository.findById(orderId).map(order -> {
        try {
            String currentStatus = order.getDecryptedStatus();
            
            // ✅ Không cho phép thay đổi payment status nếu đơn hàng đã hủy
            if ("CANCELLED".equals(currentStatus)) {
                throw new RuntimeException("Không thể thay đổi thanh toán của đơn hàng đã hủy");
            }
            
            order.setPaymentStatus(paymentStatus);
            order.setUpdatedAt(LocalDateTime.now().toString());
            
            Order savedOrder = orderRepository.save(order);
            System.out.println("✅ Payment status updated to: " + paymentStatus);
            return savedOrder;
            
        } catch (Exception e) {
            System.err.println("❌ Error updating payment status: " + e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }).orElseThrow(() -> new RuntimeException("Order not found"));
}
// src/main/java/com/shoppc/backendnosecurity/service/OrderService.java

@Transactional
public void cancelOrder(String orderId) throws Exception {
    System.out.println("❌ Cancelling order: " + orderId);
    
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));
    
    // ✅ Chỉ hủy nếu chưa giao hàng
    String currentStatus = order.getDecryptedStatus();
    System.out.println("   Current status: " + currentStatus);
    
    if ("DELIVERED".equals(currentStatus)) {
        throw new RuntimeException("Không thể hủy đơn hàng đã giao");
    }
    
    // ✅ Hoàn lại số lượng tồn kho
    System.out.println("📦 Restoring stock for items...");
for (OrderItem item : order.getItems()) {
    Product product = item.getProduct();
    if (product != null) {
        Integer quantity = item.getDecryptedQuantity();
        
        // ✅ Hoàn lại stock
        Integer currentStock = product.getDecryptedStock();
        Integer newStock = currentStock + quantity;
        product.setStock(String.valueOf(newStock));
        
        // ✅ Giảm soldCount
        Integer currentSoldCount = product.getDecryptedSoldCount();
        Integer newSoldCount = currentSoldCount - quantity;
        if (newSoldCount < 0) {
            newSoldCount = 0;
        }
        product.setSoldCount(String.valueOf(newSoldCount));
        
        productRepository.save(product);
    }
}
    
    // ✅ Cập nhật trạng thái
    order.setStatus(Order.OrderStatus.CANCELLED);
    order.setUpdatedAt(LocalDateTime.now().toString());
    orderRepository.save(order);
    
    System.out.println("✅ Order cancelled successfully: " + orderId);
}
}
