// src/main/java/com/shoppc/backendnosecurity/util/CryptoUtil.java
package com.shoppc.backendnosecurity.util;

import com.shoppc.backendnosecurity.config.CryptoKeys;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class CryptoUtil {

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    private static final String AES_ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String RSA_ALGORITHM = "RSA/ECB/PKCS1Padding";

    // ===== RSA KEYS CỐ ĐỊNH =====
    private static KeyPair rsaKeyPair;

    static {
        try {
            rsaKeyPair = loadRSAKeyPair();
        } catch (Exception e) {
            e.printStackTrace();
            try {
                rsaKeyPair = generateRSAKeyPair();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    private static KeyPair loadRSAKeyPair() throws Exception {
        String publicKeyStr = CryptoKeys.getPublicKey();
        String privateKeyStr = CryptoKeys.getPrivateKey();
        
        KeyFactory keyFactory = KeyFactory.getInstance("RSA", BouncyCastleProvider.PROVIDER_NAME);
        
        // Public Key
        byte[] publicBytes = Base64.getDecoder().decode(publicKeyStr);
        X509EncodedKeySpec publicSpec = new X509EncodedKeySpec(publicBytes);
        PublicKey publicKey = keyFactory.generatePublic(publicSpec);
        
        // Private Key
        byte[] privateBytes = Base64.getDecoder().decode(privateKeyStr);
        PKCS8EncodedKeySpec privateSpec = new PKCS8EncodedKeySpec(privateBytes);
        PrivateKey privateKey = keyFactory.generatePrivate(privateSpec);
        
        return new KeyPair(publicKey, privateKey);
    }

    public static KeyPair generateRSAKeyPair() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA", BouncyCastleProvider.PROVIDER_NAME);
        keyGen.initialize(2048);
        return keyGen.generateKeyPair();
    }

    public static String getPublicKeyBase64() {
        return Base64.getEncoder().encodeToString(rsaKeyPair.getPublic().getEncoded());
    }

    public static String getPrivateKeyBase64() {
        return Base64.getEncoder().encodeToString(rsaKeyPair.getPrivate().getEncoded());
    }

    // ===== AES =====// src/main/java/com/shoppc/backendnosecurity/util/CryptoUtil.java

// SỬA HOÀN TOÀN 2 METHOD NÀY

public static String encryptAES(String data, String key) throws Exception {
    if (data == null || data.isEmpty()) return "";
    
    // Lấy key bytes - hỗ trợ cả Base64 và Hex
    byte[] keyBytes = getKeyBytes(key);
    
    SecretKey secretKey = new SecretKeySpec(keyBytes, "AES");
    Cipher cipher = Cipher.getInstance(AES_ALGORITHM, BouncyCastleProvider.PROVIDER_NAME);
    byte[] iv = new byte[16];
    SecureRandom random = new SecureRandom();
    random.nextBytes(iv);
    IvParameterSpec ivSpec = new IvParameterSpec(iv);
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
    byte[] encrypted = cipher.doFinal(data.getBytes("UTF-8"));
    byte[] combined = new byte[iv.length + encrypted.length];
    System.arraycopy(iv, 0, combined, 0, iv.length);
    System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
    return Base64.getEncoder().encodeToString(combined);
}

public static String decryptAES(String base64Data, String key) throws Exception {
    if (base64Data == null || base64Data.isEmpty()) return "";
    
    // Lấy key bytes - hỗ trợ cả Base64 và Hex
    byte[] keyBytes = getKeyBytes(key);
    
    byte[] combined = Base64.getDecoder().decode(base64Data);
    byte[] iv = new byte[16];
    byte[] encrypted = new byte[combined.length - 16];
    System.arraycopy(combined, 0, iv, 0, 16);
    System.arraycopy(combined, 16, encrypted, 0, encrypted.length);
    
    SecretKey secretKey = new SecretKeySpec(keyBytes, "AES");
    Cipher cipher = Cipher.getInstance(AES_ALGORITHM, BouncyCastleProvider.PROVIDER_NAME);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(iv));
    byte[] decrypted = cipher.doFinal(encrypted);
    return new String(decrypted, "UTF-8");
}

// THÊM 2 METHOD NÀY
private static byte[] getKeyBytes(String key) {
    byte[] keyBytes;
    try {
        // Thử decode Base64
        keyBytes = Base64.getDecoder().decode(key);
        System.out.println("✅ Key is valid Base64");
    } catch (IllegalArgumentException e) {
        // Nếu không phải Base64, coi là Hex
        System.out.println("⚠️ Key is not Base64, treating as Hex: " + key);
        keyBytes = hexToBytes(key);
    }
    
    // Đảm bảo key đủ 32 bytes cho AES-256
    if (keyBytes.length < 32) {
        byte[] padded = new byte[32];
        System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
        keyBytes = padded;
        System.out.println("🔑 Key padded to 32 bytes");
    } else if (keyBytes.length > 32) {
        byte[] truncated = new byte[32];
        System.arraycopy(keyBytes, 0, truncated, 0, 32);
        keyBytes = truncated;
        System.out.println("🔑 Key truncated to 32 bytes");
    }
    return keyBytes;
}

private static byte[] hexToBytes(String hex) {
    if (hex == null || hex.isEmpty()) return new byte[0];
    if (hex.length() % 2 != 0) {
        hex = "0" + hex;
    }
    byte[] bytes = new byte[hex.length() / 2];
    for (int i = 0; i < bytes.length; i++) {
        int index = i * 2;
        int val = Integer.parseInt(hex.substring(index, index + 2), 16);
        bytes[i] = (byte) val;
    }
    return bytes;
}    // ===== SHA-256 =====
    public static String sha256(String data) throws Exception {
        if (data == null) return "";
        MessageDigest digest = MessageDigest.getInstance("SHA-256", BouncyCastleProvider.PROVIDER_NAME);
        byte[] hash = digest.digest(data.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(hash);
    }

    // ===== CHỮ KÝ SỐ =====
    public static String signData(String data, String base64PrivateKey) throws Exception {
        if (data == null || data.isEmpty()) return "";
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(base64PrivateKey));
        KeyFactory keyFactory = KeyFactory.getInstance("RSA", BouncyCastleProvider.PROVIDER_NAME);
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        Signature signature = Signature.getInstance("SHA256withRSA", BouncyCastleProvider.PROVIDER_NAME);
        signature.initSign(privateKey);
        signature.update(data.getBytes("UTF-8"));
        byte[] signed = signature.sign();
        return Base64.getEncoder().encodeToString(signed);
    }

    public static boolean verifySignature(String data, String signatureStr, String base64PublicKey) throws Exception {
        if (data == null || signatureStr == null) return false;
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(Base64.getDecoder().decode(base64PublicKey));
        KeyFactory keyFactory = KeyFactory.getInstance("RSA", BouncyCastleProvider.PROVIDER_NAME);
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        Signature signature = Signature.getInstance("SHA256withRSA", BouncyCastleProvider.PROVIDER_NAME);
        signature.initVerify(publicKey);
        signature.update(data.getBytes("UTF-8"));
        return signature.verify(Base64.getDecoder().decode(signatureStr));
    }

    // ===== LẤY THÔNG TIN =====
    public static Map<String, String> getKeyInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("publicKey", getPublicKeyBase64());
        info.put("privateKey", getPrivateKeyBase64());
        return info;
    }
    public static boolean isEncrypted(String data, String base64Key) {
    if (data == null || data.isEmpty()) return false;
    try {
        String decrypted = decryptAES(data, base64Key);
        // Nếu giải mã ra chuỗi có thể đọc được, thì đã mã hóa
        return decrypted != null && !decrypted.isEmpty();
    } catch (Exception e) {
        return false;
    }
}
// src/main/java/com/shoppc/backendnosecurity/util/CryptoUtil.java

// Thêm các method tiện ích
public static String encryptNumber(Number number, String key) throws Exception {
    if (number == null) return "";
    return encryptAES(number.toString(), key);
}

public static Long decryptToLong(String encrypted, String key) throws Exception {
    if (encrypted == null || encrypted.isEmpty()) return 0L;
    String decrypted = decryptAES(encrypted, key);
    return Long.parseLong(decrypted);
}

public static Integer decryptToInt(String encrypted, String key) throws Exception {
    if (encrypted == null || encrypted.isEmpty()) return 0;
    String decrypted = decryptAES(encrypted, key);
    return Integer.parseInt(decrypted);
}

public static Double decryptToDouble(String encrypted, String key) throws Exception {
    if (encrypted == null || encrypted.isEmpty()) return 0.0;
    String decrypted = decryptAES(encrypted, key);
    return Double.parseDouble(decrypted);
}

public static Boolean decryptToBoolean(String encrypted, String key) throws Exception {
    if (encrypted == null || encrypted.isEmpty()) return false;
    String decrypted = decryptAES(encrypted, key);
    return Boolean.parseBoolean(decrypted);
}
}
