// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    // ===== AUTH =====
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

login: async (email, password) => {
    console.log("🔐 Calling login API with:", { email });
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log("🔐 Login response:", data);
    return data;
},

    // ===== PRODUCTS =====
    getAllProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        // Dữ liệu từ backend đã được giải mã
        return data;
    },

    getProductsByCategory: async (category) => {
        const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
        return response.json();
    },

    getProductsOnSale: async () => {
        const response = await fetch(`${API_BASE_URL}/products/on-sale`);
        return response.json();
    },

    getProductById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        return response.json();
    },

    // ===== CART =====
    getCart: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
            if (!response.ok) {
                console.warn(`⚠️ Cart API returned ${response.status} for user ${userId}`);
                return { items: [], totalItems: 0 };
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
            return { items: [], totalItems: 0 };
        }
    },

    addToCart: async (userId, productId, quantity) => {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId, quantity })
        });
        return response.json();
    },

    updateCartItem: async (userId, itemId, quantity) => {
        const response = await fetch(`${API_BASE_URL}/cart/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId, quantity })
        });
        return response.json();
    },

    removeCartItem: async (userId, itemId) => {
        const response = await fetch(`${API_BASE_URL}/cart/remove/${userId}/${itemId}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    clearCart: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/cart/clear/${userId}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ===== ORDERS =====
    checkout: async (orderData) => {
        const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.json();
    },

    getOrdersByUser: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
        return response.json();
    },

    getOrderById: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        return response.json();
    },

    // ===== ADMIN =====
    getAllOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/orders`);
        return response.json();
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return response.json();
    },

    updatePaymentStatus: async (orderId, paymentStatus) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/payment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentStatus })
        });
        return response.json();
    },

    createProduct: async (product) => {
        const response = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return response.json();
    },

    updateProduct: async (id, product) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return response.json();
    },

    deleteProduct: async (id) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    getAllUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        return response.json();
    },

    updateUser: async (id, user) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        return response.json();
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_BASE_URL}/upload/image`, {
            method: "POST",
            body: formData
        });
        return response.json();
    },

    // ===== CHANGE PASSWORD =====
    changePassword: async (data) => {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    checkEmailExists: async (email) => {
        const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return response.json();
    },

    resetPassword: async (email, newPassword) => {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        return response.json();
    }
};
