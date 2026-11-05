// src/main/java/com/shoppc/backendnosecurity/service/ProductService.java
package com.shoppc.backendnosecurity.service;

import com.shoppc.backendnosecurity.model.Product;
import com.shoppc.backendnosecurity.repository.ProductRepository;
import com.shoppc.backendnosecurity.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.ArrayList;  // ✅ THÊM IMPORT NÀY
@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private Map<String, String> aesKeys;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
    
// src/main/java/com/shoppc/backendnosecurity/service/ProductService.java

public List<Product> getProductsByCategory(String category) throws Exception {
    System.out.println("🔍 Searching for category: " + category);
    
    // ✅ Lấy tất cả sản phẩm và lọc thủ công bằng cách giải mã category
    List<Product> allProducts = productRepository.findAll();
    List<Product> result = new ArrayList<>();
    
    for (Product product : allProducts) {
        try {
            // ✅ Giải mã category của sản phẩm
            String decryptedCategory = product.getDecryptedCategory();
            
            // ✅ So sánh với category cần tìm (không phân biệt hoa thường)
            if (category.equalsIgnoreCase(decryptedCategory)) {
                result.add(product);
                System.out.println("   ✅ Found: " + product.getDecryptedName() + " - Category: " + decryptedCategory);
            }
        } catch (Exception e) {
            System.err.println("   Error decrypting category for product: " + product.getId());
        }
    }
    
    System.out.println("✅ Found " + result.size() + " products for category: " + category);
    return result;
}
    
public List<Product> getProductsOnSale() throws Exception {
    String encryptedTrue = CryptoUtil.encryptAES("true", aesKeys.get("product"));
    List<Product> products = productRepository.findByIsOnSale(encryptedTrue);
    
    // ✅ Lọc chỉ lấy sản phẩm có discount > 0
    List<Product> result = new ArrayList<>();
    for (Product product : products) {
        try {
            Integer discount = product.getDecryptedDiscount();
            if (discount != null && discount > 0) {
                result.add(product);
            }
        } catch (Exception e) {
            // Bỏ qua sản phẩm không giải mã được
        }
    }
    return result;
}
    
    public List<Product> getDiscountedProducts() {
        return productRepository.findByDiscountGreaterThan(0);
    }
    
    public List<Product> getBestsellerProducts() throws Exception {
        String encryptedTrue = CryptoUtil.encryptAES("true", aesKeys.get("product"));
        return productRepository.findByIsBestseller(encryptedTrue);
    }
    
    public List<Product> getNewProducts() throws Exception {
        String encryptedTrue = CryptoUtil.encryptAES("true", aesKeys.get("product"));
        return productRepository.findByIsNew(encryptedTrue);
    }
    
    public List<Product> searchProducts(String keyword) throws Exception {
        String encryptedKeyword = CryptoUtil.encryptAES(keyword, aesKeys.get("product"));
        return productRepository.findByBrandContaining(encryptedKeyword);
    }
    
    public Product createProduct(Product product) throws Exception {
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, Product productDetails) throws Exception {
        return productRepository.findById(id).map(product -> {
            try {
                product.setName(productDetails.getName());
                product.setBrand(productDetails.getBrand());
                product.setCategory(productDetails.getCategory());
                product.setPrice(productDetails.getPrice());
                product.setOldPrice(productDetails.getOldPrice());
                product.setDiscount(productDetails.getDiscount());
                product.setStock(productDetails.getStock());
                product.setRating(productDetails.getRating());
                product.setReviews(productDetails.getReviews());
                product.setImage(productDetails.getImage());
                product.setImages(productDetails.getImages());
                product.setSpecs(productDetails.getSpecs());
                product.setIsNew(productDetails.getIsNew());
                product.setIsBestseller(productDetails.getIsBestseller());
                product.setDescription(productDetails.getDescription());
                return productRepository.save(product);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).orElse(null);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
