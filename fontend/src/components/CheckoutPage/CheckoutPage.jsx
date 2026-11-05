// src/components/CheckoutPage/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Truck, Shield, 
  User, Phone, MapPin, Wallet
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;
  
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: user?.name || "",
    phoneNumber: "",
    shippingAddress: "",
    paymentMethod: "CASH",
    note: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const data = await api.getCart(userId);
      if (data) {
        setCart(data);
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Vui lòng nhập họ tên";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = "Vui lòng nhập địa chỉ giao hàng";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = {
        userId: userId,
        ...formData
      };
      
      const result = await api.checkout(orderData);
      
      if (result.success) {
        setOrderSuccess(true);
        setStep(2);
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => {
          navigate("/cart?tab=shipping");
        }, 2000);
      } else {
        alert("Đặt hàng thất bại: " + (result.error || "Vui lòng thử lại"));
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tiền với giá đã giảm
  const totalAmount = cartItems.reduce((sum, item) => {
    const product = item.product || {};
    const originalPrice = item.price || product.price || 0;
    const discount = product.discount || 0;
    const salePrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
    return sum + (salePrice * item.quantity);
  }, 0);

  if (!cart || cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <span>🛒</span>
            <h2>Giỏ hàng trống</h2>
            <p>Không có sản phẩm để thanh toán</p>
            <button onClick={() => navigate("/")} className="back-shop-btn">
              Quay lại mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h2>Đặt hàng thành công!</h2>
            <p>Cảm ơn bạn đã mua sắm tại ShopPC</p>
            <div className="success-details">
              <div className="success-item"><User size={16} /><span>{formData.recipientName}</span></div>
              <div className="success-item"><Phone size={16} /><span>{formData.phoneNumber}</span></div>
              <div className="success-item"><MapPin size={16} /><span>{formData.shippingAddress}</span></div>
              <div className="success-item"><Wallet size={16} /><span>{formData.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}</span></div>
            </div>
            <p className="redirect-text">Đang chuyển đến đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <button className="back-to-cart" onClick={() => navigate("/cart")}>
          <ArrowLeft size={18} /> Quay lại giỏ hàng
        </button>

        <div className="checkout-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="checkout-title"
          >
            Thanh toán
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hoàn tất đơn hàng của bạn
          </motion.p>
        </div>

        <div className="checkout-layout">
          {/* LEFT - Sản phẩm */}
          <motion.div 
            className="checkout-products"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="products-title">🛍️ Sản phẩm đặt hàng</h3>
            
            <div className="products-list">
              {cartItems.map((item, idx) => {
                const product = item.product || {};
                const originalPrice = item.price || product.price || 0;
                const discount = product.discount || 0;
                const salePrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
                
                return (
                  <motion.div 
                    key={item.id} 
                    className="product-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <img 
                      src={product.image || 'https://via.placeholder.com/60'} 
                      alt={product.name || 'Sản phẩm'} 
                    />
                    <div className="product-info">
                      <p className="product-name">{product.name || 'Sản phẩm'}</p>
                      <p className="product-brand">{product.brand || ''}</p>
                      <div className="product-meta">
                        <span className="product-qty">Số lượng: {item.quantity}</span>
                        <div className="product-price-wrapper">
                          {discount > 0 ? (
                            <>
                              <span className="sale-price-text">{salePrice.toLocaleString()}đ</span>
                              <span className="original-price-text">{originalPrice.toLocaleString()}đ</span>
                              <span className="discount-badge">-{discount}%</span>
                            </>
                          ) : (
                            <span className="price-normal">{originalPrice.toLocaleString()}đ</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="products-total">
              <div className="total-row">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="total-row grand">
                <span>Tổng cộng</span>
                <span style={{ color: '#ff3b5c', fontSize: '20px' }}>
                  {totalAmount.toLocaleString()}đ
                </span>
              </div>
            </div>

            <div className="products-features">
              <div className="feature"><Truck size={16} /> Giao hàng miễn phí</div>
              <div className="feature"><Shield size={16} /> Bảo hành 12 tháng</div>
            </div>
          </motion.div>

          {/* RIGHT - Form thông tin */}
          <motion.div 
            className="checkout-form-wrapper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>📝 Thông tin nhận hàng</h3>
                
                <div className="form-group">
                  <label>Họ và tên <span className="required">*</span></label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên người nhận"
                    className={errors.recipientName ? "error" : ""}
                  />
                  {errors.recipientName && <span className="error-text">{errors.recipientName}</span>}
                </div>

                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại (10-11 số)"
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Địa chỉ giao hàng <span className="required">*</span></label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ nhận hàng"
                    className={errors.shippingAddress ? "error" : ""}
                  />
                  {errors.shippingAddress && <span className="error-text">{errors.shippingAddress}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>💳 Phương thức thanh toán</h3>
                
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'CASH' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={formData.paymentMethod === 'CASH'}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>Tiền mặt</strong>
                      <p>Thanh toán khi nhận hàng</p>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={formData.paymentMethod === 'BANK_TRANSFER'}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>Chuyển khoản</strong>
                      <p>Thanh toán qua ngân hàng</p>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'BANK_TRANSFER' && (
                  <div className="bank-info">
                    <p>Thông tin chuyển khoản:</p>
                    <div className="bank-details">
                      <span><strong>Ngân hàng:</strong> Vietcombank</span>
                      <span><strong>Số tài khoản:</strong> 1234567890</span>
                      <span><strong>Chủ tài khoản:</strong> SHOPPC</span>
                      <span><strong>Nội dung:</strong> Mã đơn hàng khi đặt</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Ghi chú (nếu có)</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    rows="2"
                  />
                </div>
              </div>

              <button type="submit" className="submit-order-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đặt hàng
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
