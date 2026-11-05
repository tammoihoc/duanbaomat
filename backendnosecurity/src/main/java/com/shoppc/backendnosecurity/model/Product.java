// src/main/java/com/shoppc/backendnosecurity/model/Product.java
package com.shoppc.backendnosecurity.model;

import com.shoppc.backendnosecurity.util.CryptoUtil;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String category;

    @Column(columnDefinition = "TEXT")
    private String price;

    @Column(columnDefinition = "TEXT")
    private String salePrice;

    @Column(columnDefinition = "TEXT")
    private String oldPrice;

    @Column(columnDefinition = "TEXT")
    private String discount;

    @Column(columnDefinition = "TEXT")
    private String stock;

    @Column(columnDefinition = "TEXT")
    private String soldCount;

    @Column(columnDefinition = "TEXT")
    private String rating;

    @Column(columnDefinition = "TEXT")
    private String reviews;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String images;

    @Column(columnDefinition = "TEXT")
    private String specs;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String isNew;

    @Column(columnDefinition = "TEXT")
    private String isBestseller;

    @Column(columnDefinition = "TEXT")
    private String isOnSale;

    @Column(columnDefinition = "TEXT")
    private String createdAt;

    @Column(columnDefinition = "TEXT")
    private String updatedAt;

// src/main/java/com/shoppc/backendnosecurity/model/Product.java

@PrePersist
protected void onCreate() throws Exception {
    System.out.println("📦 Product @PrePersist triggered");
    this.createdAt = encryptField(LocalDateTime.now().toString(), "product");
    this.updatedAt = encryptField(LocalDateTime.now().toString(), "product");
    
    // ✅ Mã hóa category nếu chưa được mã hóa
    if (category != null && !category.isEmpty()) {
        try {
            // Thử giải mã - nếu thành công thì đã mã hóa
            decryptField(category, "product");
            System.out.println("   Category already encrypted, skipping...");
        } catch (Exception e) {
            // Chưa mã hóa → mã hóa
            System.out.println("   Encrypting category...");
            this.category = encryptField(category, "product");
        }
    }
    
    encryptFields();
    calculateSalePrice();
    signData(getDataToSign());
    System.out.println("✅ Product @PrePersist completed");
}

    @PreUpdate
    protected void onUpdate() throws Exception {
        System.out.println("📦 Product @PreUpdate triggered for ID: " + getId());
        this.updatedAt = encryptField(LocalDateTime.now().toString(), "product");
        encryptFields();
        calculateSalePrice();
        signData(getDataToSign());
        System.out.println("✅ Product @PreUpdate completed");
    }

    private void encryptFields() throws Exception {
        System.out.println("🔐 Encrypting product fields...");
        
        // ===== TEXT FIELDS - Kiểm tra đã mã hóa chưa =====
        if (name != null && !name.isEmpty()) {
            try { 
                decryptField(name, "product"); 
                System.out.println("   Name already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting name...");
                this.name = encryptField(name, "product"); 
            }
        }
        
        if (brand != null && !brand.isEmpty()) {
            try { 
                decryptField(brand, "product"); 
                System.out.println("   Brand already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting brand...");
                this.brand = encryptField(brand, "product"); 
            }
        }
        
        if (category != null && !category.isEmpty()) {
            try { 
                decryptField(category, "product"); 
                System.out.println("   Category already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting category...");
                this.category = encryptField(category, "product"); 
            }
        }
        
        if (description != null && !description.isEmpty()) {
            try { 
                decryptField(description, "product"); 
                System.out.println("   Description already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting description...");
                this.description = encryptField(description, "product"); 
            }
        }
        
        if (specs != null && !specs.isEmpty()) {
            try { 
                decryptField(specs, "product"); 
                System.out.println("   Specs already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting specs...");
                this.specs = encryptField(specs, "product"); 
            }
        }
        
        if (image != null && !image.isEmpty()) {
            try { 
                decryptField(image, "product"); 
                System.out.println("   Image already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting image...");
                this.image = encryptField(image, "product"); 
            }
        }
        
        if (images != null && !images.isEmpty()) {
            try { 
                decryptField(images, "product"); 
                System.out.println("   Images already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting images...");
                this.images = encryptField(images, "product"); 
            }
        }
        
        // ===== NUMBER FIELDS =====
        if (price != null && !price.isEmpty()) {
            try { 
                decryptField(price, "product"); 
                System.out.println("   Price already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting price...");
                this.price = encryptField(price, "product"); 
            }
        }
        
        if (salePrice != null && !salePrice.isEmpty()) {
            try { 
                decryptField(salePrice, "product"); 
                System.out.println("   SalePrice already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting salePrice...");
                this.salePrice = encryptField(salePrice, "product"); 
            }
        }
        
        if (oldPrice != null && !oldPrice.isEmpty()) {
            try { 
                decryptField(oldPrice, "product"); 
                System.out.println("   OldPrice already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting oldPrice...");
                this.oldPrice = encryptField(oldPrice, "product"); 
            }
        }
        
        if (discount != null && !discount.isEmpty()) {
            try { 
                decryptField(discount, "product"); 
                System.out.println("   Discount already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting discount...");
                this.discount = encryptField(discount, "product"); 
            }
        }
        
        if (stock != null && !stock.isEmpty()) {
            try { 
                decryptField(stock, "product"); 
                System.out.println("   Stock already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting stock...");
                this.stock = encryptField(stock, "product"); 
            }
        }
        
        if (soldCount != null && !soldCount.isEmpty()) {
            try { 
                decryptField(soldCount, "product"); 
                System.out.println("   SoldCount already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting soldCount...");
                this.soldCount = encryptField(soldCount, "product"); 
            }
        }
        
        if (rating != null && !rating.isEmpty()) {
            try { 
                decryptField(rating, "product"); 
                System.out.println("   Rating already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting rating...");
                this.rating = encryptField(rating, "product"); 
            }
        }
        
        if (reviews != null && !reviews.isEmpty()) {
            try { 
                decryptField(reviews, "product"); 
                System.out.println("   Reviews already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting reviews...");
                this.reviews = encryptField(reviews, "product"); 
            }
        }
        
        // ===== BOOLEAN FIELDS =====
        if (isNew != null && !isNew.isEmpty()) {
            try { 
                decryptField(isNew, "product"); 
                System.out.println("   isNew already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting isNew...");
                this.isNew = encryptField(isNew, "product"); 
            }
        }
        
        if (isBestseller != null && !isBestseller.isEmpty()) {
            try { 
                decryptField(isBestseller, "product"); 
                System.out.println("   isBestseller already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting isBestseller...");
                this.isBestseller = encryptField(isBestseller, "product"); 
            }
        }
        
        if (isOnSale != null && !isOnSale.isEmpty()) {
            try { 
                decryptField(isOnSale, "product"); 
                System.out.println("   isOnSale already encrypted, skipping...");
            } catch (Exception e) { 
                System.out.println("   Encrypting isOnSale...");
                this.isOnSale = encryptField(isOnSale, "product"); 
            }
        }
        
        System.out.println("✅ Product encryptFields completed");
    }

    private String getDataToSign() {
        String data = "";
        data += (getId() != null ? getId() : "");
        data += (name != null ? name : "");
        data += (brand != null ? brand : "");
        data += (price != null ? price : "");
        data += (description != null ? description : "");
        return data;
    }

    private void calculateSalePrice() throws Exception {
        System.out.println("💰 Calculating sale price...");
        String discountStr = decryptField(discount, "product");
        String priceStr = decryptField(price, "product");
        
        if (discountStr != null && !discountStr.isEmpty() && priceStr != null && !priceStr.isEmpty()) {
            int discountVal = Integer.parseInt(discountStr);
            Long priceVal = Long.parseLong(priceStr);
            if (discountVal > 0) {
                Long salePriceVal = priceVal - (priceVal * discountVal / 100);
                this.salePrice = encryptField(salePriceVal.toString(), "product");
                this.isOnSale = encryptField("true", "product");
                System.out.println("   Sale price: " + salePriceVal);
            } else {
                this.salePrice = encryptField(priceStr, "product");
                this.isOnSale = encryptField("false", "product");
                System.out.println("   No discount, sale price = original price");
            }
        }
    }

    // ===== GETTERS =====
    public String getName() { return name; }
    public String getBrand() { return brand; }
    public String getCategory() { return category; }
    public String getPrice() { return price; }
    public String getSalePrice() { return salePrice; }
    public String getOldPrice() { return oldPrice; }
    public String getDiscount() { return discount; }
    public String getStock() { return stock; }
    public String getSoldCount() { return soldCount; }
    public String getRating() { return rating; }
    public String getReviews() { return reviews; }
    public String getImage() { return image; }
    public String getImages() { return images; }
    public String getSpecs() { return specs; }
    public String getDescription() { return description; }
    public String getIsNew() { return isNew; }
    public String getIsBestseller() { return isBestseller; }
    public String getIsOnSale() { return isOnSale; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }

    // ===== SETTERS =====
    public void setName(String name) { this.name = name; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setCategory(String category) { this.category = category; }
    
    public void setPrice(Long price) {
        if (price != null) {
            this.price = price.toString();
        }
    }
    public void setPrice(String price) { this.price = price; }
    
    public void setSalePrice(String salePrice) { this.salePrice = salePrice; }
    public void setOldPrice(String oldPrice) { this.oldPrice = oldPrice; }
    
    public void setDiscount(Integer discount) {
        if (discount != null) {
            this.discount = discount.toString();
        }
    }
    public void setDiscount(String discount) { this.discount = discount; }
    
    public void setStock(Integer stock) {
        if (stock != null) {
            this.stock = stock.toString();
        }
    }
    public void setStock(String stock) { this.stock = stock; }
    
    public void setSoldCount(Integer soldCount) {
        if (soldCount != null) {
            this.soldCount = soldCount.toString();
        }
    }
    public void setSoldCount(String soldCount) { this.soldCount = soldCount; }
    
    public void setRating(Double rating) {
        if (rating != null) {
            this.rating = rating.toString();
        }
    }
    public void setRating(String rating) { this.rating = rating; }
    
    public void setReviews(Integer reviews) {
        if (reviews != null) {
            this.reviews = reviews.toString();
        }
    }
    public void setReviews(String reviews) { this.reviews = reviews; }
    
    public void setImage(String image) { this.image = image; }
    public void setImages(String images) { this.images = images; }
    public void setSpecs(String specs) { this.specs = specs; }
    public void setDescription(String description) { this.description = description; }
    
    public void setIsNew(Boolean isNew) {
        if (isNew != null) {
            this.isNew = isNew.toString();
        }
    }
    public void setIsNew(String isNew) { this.isNew = isNew; }
    
    public void setIsBestseller(Boolean isBestseller) {
        if (isBestseller != null) {
            this.isBestseller = isBestseller.toString();
        }
    }
    public void setIsBestseller(String isBestseller) { this.isBestseller = isBestseller; }
    
    public void setIsOnSale(Boolean isOnSale) {
        if (isOnSale != null) {
            this.isOnSale = isOnSale.toString();
        }
    }
    public void setIsOnSale(String isOnSale) { this.isOnSale = isOnSale; }
    
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    // ===== PHƯƠNG THỨC GIẢI MÃ =====
    public String getDecryptedName() throws Exception { 
        String val = decryptField(name, "product");
        return val != null ? val : "";
    }
    public String getDecryptedBrand() throws Exception { 
        String val = decryptField(brand, "product");
        return val != null ? val : "";
    }
    public String getDecryptedCategory() throws Exception { 
        String val = decryptField(category, "product");
        return val != null ? val : "";
    }
    
    public Long getDecryptedPrice() throws Exception { 
        String val = decryptField(price, "product");
        return val != null && !val.isEmpty() ? Long.parseLong(val) : 0L;
    }
    
    public Long getDecryptedSalePrice() throws Exception {
        String val = decryptField(salePrice, "product");
        return val != null && !val.isEmpty() ? Long.parseLong(val) : 0L;
    }
    
    public Long getDecryptedOldPrice() throws Exception {
        String val = decryptField(oldPrice, "product");
        return val != null && !val.isEmpty() ? Long.parseLong(val) : 0L;
    }
    
    public Integer getDecryptedDiscount() throws Exception {
        String val = decryptField(discount, "product");
        return val != null && !val.isEmpty() ? Integer.parseInt(val) : 0;
    }
    
    public Integer getDecryptedStock() throws Exception {
        String val = decryptField(stock, "product");
        return val != null && !val.isEmpty() ? Integer.parseInt(val) : 0;
    }
    
    public Integer getDecryptedSoldCount() throws Exception {
        String val = decryptField(soldCount, "product");
        return val != null && !val.isEmpty() ? Integer.parseInt(val) : 0;
    }
    
    public Double getDecryptedRating() throws Exception {
        String val = decryptField(rating, "product");
        return val != null && !val.isEmpty() ? Double.parseDouble(val) : 0.0;
    }
    
    public Integer getDecryptedReviews() throws Exception {
        String val = decryptField(reviews, "product");
        return val != null && !val.isEmpty() ? Integer.parseInt(val) : 0;
    }
    
    public String getDecryptedImage() throws Exception { 
        String val = decryptField(image, "product");
        return val != null ? val : "";
    }
    
    public String getDecryptedImages() throws Exception { 
        String val = decryptField(images, "product");
        return val != null ? val : "";
    }
    
    public String getDecryptedSpecs() throws Exception { 
        String val = decryptField(specs, "product");
        return val != null ? val : "{}";
    }
    
    public String getDecryptedDescription() throws Exception { 
        String val = decryptField(description, "product");
        return val != null ? val : "";
    }
    
    public Boolean getDecryptedIsNew() throws Exception {
        String val = decryptField(isNew, "product");
        return val != null && !val.isEmpty() ? Boolean.parseBoolean(val) : false;
    }
    
    public Boolean getDecryptedIsBestseller() throws Exception {
        String val = decryptField(isBestseller, "product");
        return val != null && !val.isEmpty() ? Boolean.parseBoolean(val) : false;
    }
    
    public Boolean getDecryptedIsOnSale() throws Exception {
        String val = decryptField(isOnSale, "product");
        return val != null && !val.isEmpty() ? Boolean.parseBoolean(val) : false;
    }
    
    public LocalDateTime getDecryptedCreatedAt() throws Exception {
        String dateStr = decryptField(createdAt, "product");
        return dateStr != null && !dateStr.isEmpty() ? LocalDateTime.parse(dateStr) : null;
    }
    
    public LocalDateTime getDecryptedUpdatedAt() throws Exception {
        String dateStr = decryptField(updatedAt, "product");
        return dateStr != null && !dateStr.isEmpty() ? LocalDateTime.parse(dateStr) : null;
    }
}
