// src/main/java/com/shoppc/backendnosecurity/repository/ProductRepository.java
package com.shoppc.backendnosecurity.repository;

import com.shoppc.backendnosecurity.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByDiscountGreaterThan(Integer discount);
    List<Product> findByIsBestseller(String isBestseller);
    List<Product> findByIsNew(String isNew);
    List<Product> findByIsOnSale(String isOnSale);
    List<Product> findByBrandContaining(String brand);
    List<Product> findByCategoryAndIsOnSale(String category, String isOnSale);
}
