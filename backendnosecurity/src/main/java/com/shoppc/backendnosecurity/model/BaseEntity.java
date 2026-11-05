// src/main/java/com/shoppc/backendnosecurity/model/BaseEntity.java
package com.shoppc.backendnosecurity.model;

import com.shoppc.backendnosecurity.config.ApplicationContextProvider;
import com.shoppc.backendnosecurity.util.CryptoUtil;
import jakarta.persistence.*;
import java.util.Map;
import java.util.UUID;

@MappedSuperclass
public abstract class BaseEntity {
    
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Column(name = "encryption_key_version")
    private String encryptionKeyVersion = "v1";
    
    @Column(name = "data_signature", columnDefinition = "TEXT")
    private String dataSignature;
    
    @PrePersist
    public void prePersist() {
        if (id == null || id.isEmpty()) {
            id = UUID.randomUUID().toString();
        }
    }
    
    // GETTERS
    public String getId() { return id; }
    public String getEncryptionKeyVersion() { return encryptionKeyVersion; }
    public String getDataSignature() { return dataSignature; }
    
    // SETTERS
    public void setId(String id) { this.id = id; }
    public void setEncryptionKeyVersion(String encryptionKeyVersion) { this.encryptionKeyVersion = encryptionKeyVersion; }
    public void setDataSignature(String dataSignature) { this.dataSignature = dataSignature; }
    
    protected Map<String, String> getAesKeys() {
        return ApplicationContextProvider.getBean("aesKeys", Map.class);
    }
    
    protected String encryptField(String data, String keyName) throws Exception {
        if (data == null || data.isEmpty()) return "";
        Map<String, String> keys = getAesKeys();
        return CryptoUtil.encryptAES(data, keys.get(keyName));
    }
    
protected String decryptField(String data, String keyName) throws Exception {
    if (data == null || data.isEmpty()) return "";
    
    // ✅ Trim dữ liệu để loại bỏ khoảng trắng
    String trimmedData = data.trim();
    
    try {
        Map<String, String> keys = getAesKeys();
        String key = keys.get(keyName);
        if (key == null) {
            throw new RuntimeException("Key not found: " + keyName);
        }
        return CryptoUtil.decryptAES(trimmedData, key);
    } catch (IllegalArgumentException e) {
        System.err.println("❌ Base64 decode error for field: " + keyName);
        System.err.println("   Data: " + trimmedData.substring(0, Math.min(50, trimmedData.length())) + "...");
        throw e;
    }
}    
    protected void signData(String dataToSign) throws Exception {
        if (dataToSign == null || dataToSign.isEmpty()) {
            this.dataSignature = "";
            return;
        }
        String privateKey = CryptoUtil.getPrivateKeyBase64();
        this.dataSignature = CryptoUtil.signData(dataToSign, privateKey);
    }
    
    public boolean verifySignature(String data, String signature) throws Exception {
        if (signature == null || signature.isEmpty()) return true;
        return CryptoUtil.verifySignature(data, signature, CryptoUtil.getPublicKeyBase64());
    }
}
