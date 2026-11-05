// src/main/java/com/shoppc/backendnosecurity/controller/ProductController.java
package com.shoppc.backendnosecurity.controller;

import com.shoppc.backendnosecurity.model.Product;
import com.shoppc.backendnosecurity.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<Map<String, Object>> decryptedProducts = products.stream()
            .map(this::decryptProduct)
            .collect(Collectors.toList());
        return ResponseEntity.ok(decryptedProducts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
            .map(this::decryptProduct)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Map<String, Object>>> getProductsByCategory(@PathVariable String category) {
        try {
            List<Product> products = productService.getProductsByCategory(category);
            List<Map<String, Object>> decryptedProducts = products.stream()
                .map(this::decryptProduct)
                .collect(Collectors.toList());
            return ResponseEntity.ok(decryptedProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/on-sale")
    public ResponseEntity<List<Map<String, Object>>> getProductsOnSale() {
        try {
            List<Product> products = productService.getProductsOnSale();
            List<Map<String, Object>> decryptedProducts = products.stream()
                .map(this::decryptProduct)
                .collect(Collectors.toList());
            return ResponseEntity.ok(decryptedProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchProducts(@RequestParam String keyword) {
        try {
            List<Product> products = productService.searchProducts(keyword);
            List<Map<String, Object>> decryptedProducts = products.stream()
                .map(this::decryptProduct)
                .collect(Collectors.toList());
            return ResponseEntity.ok(decryptedProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    private Map<String, Object> decryptProduct(Product product) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("id", product.getId());
            result.put("name", product.getDecryptedName());
            result.put("brand", product.getDecryptedBrand());
            result.put("category", product.getDecryptedCategory());
            result.put("price", product.getDecryptedPrice());
            result.put("salePrice", product.getDecryptedSalePrice());
            result.put("oldPrice", product.getDecryptedOldPrice());
            result.put("discount", product.getDecryptedDiscount());
            result.put("stock", product.getDecryptedStock());
            result.put("soldCount", product.getDecryptedSoldCount());
            result.put("rating", product.getDecryptedRating());
            result.put("reviews", product.getDecryptedReviews());
            result.put("image", product.getDecryptedImage());
            result.put("images", product.getDecryptedImages());
            result.put("specs", product.getDecryptedSpecs());
            result.put("description", product.getDecryptedDescription());
            result.put("isNew", product.getDecryptedIsNew());
            result.put("isBestseller", product.getDecryptedIsBestseller());
            result.put("isOnSale", product.getDecryptedIsOnSale());
            result.put("createdAt", product.getDecryptedCreatedAt());
            result.put("updatedAt", product.getDecryptedUpdatedAt());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
