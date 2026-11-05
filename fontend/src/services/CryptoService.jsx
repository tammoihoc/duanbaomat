// src/services/CryptoService.js
export class CryptoService {
    constructor() {
        this.publicKey = null;
        this.privateKey = null;
    }

    // Lấy public key từ backend
    async init() {
        try {
            const response = await fetch('http://localhost:8080/api/crypto/public-key');
            const data = await response.json();
            this.publicKey = data.publicKey;
            return true;
        } catch (error) {
            console.error('Failed to get public key:', error);
            return false;
        }
    }

    // Giải mã dữ liệu (sử dụng public key)
    async decryptData(encryptedData) {
        // Trong thực tế, Frontend không thể giải mã RSA với public key
        // Nên Backend sẽ giải mã và trả về dữ liệu đã giải mã
        // Hoặc sử dụng AES key được mã hóa bằng RSA public key
        return encryptedData;
    }

    // Kiểm tra chữ ký số
    async verifySignature(data, signature) {
        // Gọi API backend để kiểm tra chữ ký
        const response = await fetch('http://localhost:8080/api/crypto/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, signature })
        });
        return response.json();
    }
}

export default new CryptoService();
