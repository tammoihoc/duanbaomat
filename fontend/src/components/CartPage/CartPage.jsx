// src/components/CartPage/CartPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  Truck, Shield, CreditCard, Clock, CheckCircle, 
  XCircle, Package, Eye, Calendar, Zap, Heart, MapPin, Phone
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"; // THÊM useLocation
import { api } from "../../services/api";
import "./CartPage.css";

export default function CartPage() {
  const location = useLocation(); // THÊM DÒNG NÀaY
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cart");
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  const statusMap = {
    'PENDING': { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fef3c7', icon: Clock },
    'CONFIRMED': { label: 'Đã xác nhận', color: '#3b82f6', bg: '#dbeafe', icon: CheckCircle },
    'SHIPPING': { label: 'Đang giao', color: '#8b5cf6', bg: '#ede9fe', icon: Truck },
    'DELIVERED': { label: 'Đã nhận', color: '#10b981', bg: '#d1fae5', icon: Package },
    'CANCELLED': { label: 'Đã hủy', color: '#ef4444', bg: '#fecaca', icon: XCircle }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCart();
    fetchOrders();
  }, [userId]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "shipping") {
      setActiveTab("shipping");
    } else if (tab === "delivered") {
      setActiveTab("delivered");
    } else {
      setActiveTab("cart");
    }
  }, [location.search]);
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await api.getCart(userId);
      if (data) {
        setCart(data);
        // Dữ liệu items đã được giải mã từ backend
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await api.getOrdersByUser(userId);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    try {
      const result = await api.updateCartItem(userId, itemId, newQuantity);
      if (result.success) {
        window.dispatchEvent(new Event("cartUpdated"));
        const data = await api.getCart(userId);
        if (data) setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      fetchCart();
    }
  };

  const removeItem = async (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    try {
      const result = await api.removeCartItem(userId, itemId);
      if (result.success) window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
      fetchCart();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SHOPPC30") setPromoApplied(true);
  };

  const handleCheckout = () => navigate("/checkout");

const shippingOrders = orders.filter(o => 
  o.status === "PENDING" || 
  o.status === "CONFIRMED" || 
  o.status === "SHIPPING"
);
  const deliveredOrders = orders.filter(o => o.status === "DELIVERED");

  if (!userId) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem giỏ hàng</p>
            <Link to="/login" className="btn-primary">Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "cart", label: "Giỏ hàng", icon: ShoppingBag, count: cartItems.length },
    { id: "shipping", label: "Đang giao", icon: Truck, count: shippingOrders.length },
    { id: "delivered", label: "Đã nhận", icon: Package, count: deliveredOrders.length }
  ];

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="cart-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cart-header-content">
            <div className="header-left">
              <span className="header-icon">🛒</span>
              <div>
                <h1 className="cart-title">Giỏ hàng của bạn</h1>
                <p className="cart-subtitle">Quản lý sản phẩm và theo dõi đơn hàng</p>
              </div>
            </div>
            <div className="header-stats">
              <span className="stat-item">
                <span className="stat-number">{cartItems.length}</span>
                <span className="stat-label">Sản phẩm</span>
              </span>
              <span className="stat-divider">|</span>
              <span className="stat-item">
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Đơn hàng</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="cart-tabs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                className={`tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="tab-badge">{tab.count}</span>
                )}
                {isActive && <div className="tab-active-line" />}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div 
          className="cart-tab-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "cart" && renderCart()}
              {activeTab === "shipping" && renderShippingOrders()}
              {activeTab === "delivered" && renderDeliveredOrders()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

<AnimatePresence>
  {selectedOrder && (
    <motion.div 
      className="order-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedOrder(null)}
    >
      <motion.div 
        className="order-modal-content"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
        <h3>📋 Chi tiết đơn hàng</h3>
        <p className="modal-code">Mã: #{selectedOrder.orderCode}</p>
        
        <div className="order-detail-grid">
          <div><strong>Khách hàng:</strong> {selectedOrder.recipientName || '---'}</div>
          <div><strong>SĐT:</strong> {selectedOrder.phoneNumber || '---'}</div>
          <div><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress || '---'}</div>
          <div><strong>Thanh toán:</strong> {selectedOrder.paymentMethod === 'CASH' ? '💵 Tiền mặt' : '🏦 Chuyển khoản'}</div>
          <div><strong>Trạng thái:</strong> {statusMap[selectedOrder.status]?.label || selectedOrder.status}</div>
          <div><strong>Tổng tiền:</strong> <strong style={{ color: '#ff3b5c' }}>{selectedOrder.totalAmount?.toLocaleString()}đ</strong></div>
          <div><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderedAt)}</div>
          <div><strong>Cập nhật:</strong> {formatDate(selectedOrder.updatedAt)}</div>
        </div>
        
        {selectedOrder.note && (
          <div className="order-note"><strong>📝 Ghi chú:</strong> {selectedOrder.note}</div>
        )}
        
        <div className="order-items-detail">
          <h4>🛍️ Sản phẩm:</h4>
          {selectedOrder.items?.length > 0 ? (
            selectedOrder.items.map((item, idx) => {
              const productName = item.productName || item.product?.name || 'Sản phẩm';
              const price = item.price || 0;
              const quantity = item.quantity || 0;
              
              return (
                <div key={idx} className="order-item-detail">
                  <span className="item-name">{productName}</span>
                  <span className="item-qty">x{quantity}</span>
                  <span className="item-price">{price?.toLocaleString()}đ</span>
                </div>
              );
            })
          ) : (
            <p style={{ color: '#999', textAlign: 'center' }}>Không có sản phẩm</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );

  // ===== RENDER FUNCTIONS =====
// src/components/CartPage/CartPage.jsx
// Sửa phần renderCart() - Đơn giá chỉ hiển thị giá đã giảm

function renderCart() {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div className="empty-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="empty-icon">🛒</div>
        <h2>Giỏ hàng trống</h2>
        <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <Link to="/" className="btn-primary">Mua sắm ngay <ArrowRight size={18} /></Link>
      </motion.div>
    );
  }

  // ✅ Tính subtotal từ giá đã giảm
  const calculatedSubtotal = cartItems.reduce((sum, item) => {
    const product = item.product || {};
    const originalPrice = item.price || product.price || 0;
    const discount = product.discount || 0;
    const salePrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
    return sum + (salePrice * item.quantity);
  }, 0);

  const shipping = calculatedSubtotal > 5000000 ? 0 : 30000;
  const discountAmount = promoApplied ? calculatedSubtotal * 0.1 : 0;
  const totalAmount = calculatedSubtotal + shipping - discountAmount;

  return (
    <div className="cart-grid">
      <div className="cart-items-wrapper">
        <div className="cart-items-header">
          <span>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thành tiền</span>
          <span></span>
        </div>

        {cartItems.map((item, idx) => {
          const product = item.product || {};
          const productName = product.name || 'Sản phẩm';
          const productImage = product.image || 'https://via.placeholder.com/80';
          const productBrand = product.brand || '';
          const productId = product.id;
          
          const originalPrice = item.price || product.price || 0;
          const discount = product.discount || 0;
          // ✅ Giá đã giảm
          const salePrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
          
          return (
            <motion.div
              key={item.id}
              className="cart-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className="cart-item-info">
                <div className="cart-item-image" onClick={() => handleProductClick(productId)}>
                  <img src={productImage} alt={productName} />
                  {discount > 0 && (
                    <span className="cart-item-discount">-{discount}%</span>
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 onClick={() => handleProductClick(productId)}>{productName}</h3>
                  <p>{productBrand}</p>
                  {discount > 0 && (
                    <div className="cart-item-price-info">
                      <span className="original-price">{originalPrice.toLocaleString()}đ</span>
                      <span className="sale-price">→ {salePrice.toLocaleString()}đ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ Đơn giá: CHỈ HIỂN THỊ GIÁ ĐÃ GIẢM */}
              <div className="cart-item-price">
                {salePrice.toLocaleString()}đ
              </div>

              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>

              <div className="cart-item-total">
                {(salePrice * item.quantity).toLocaleString()}đ
              </div>

              <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>📋 Tóm tắt đơn hàng</h3>
        
        <div className="summary-row">
          <span>Tạm tính</span>
          <span>{calculatedSubtotal.toLocaleString()}đ</span>
        </div>
        
        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}đ`}</span>
        </div>
        
        {promoApplied && (
          <div className="summary-row discount">
            <span>Giảm giá (10%)</span>
            <span>-{discountAmount.toLocaleString()}đ</span>
          </div>
        )}

        <div className="promo-code">
          <input 
            type="text" 
            placeholder="Nhập mã giảm giá" 
            value={promoCode} 
            onChange={(e) => setPromoCode(e.target.value)} 
            disabled={promoApplied} 
          />
          <button onClick={applyPromo} disabled={promoApplied}>
            {promoApplied ? "✅ Đã áp dụng" : "Áp dụng"}
          </button>
        </div>

        <div className="summary-total">
          <span>Tổng cộng</span>
          <span style={{ color: '#ff3b5c', fontSize: '22px' }}>
            {totalAmount.toLocaleString()}đ
          </span>
        </div>

        <button className="checkout-btn" onClick={handleCheckout}>
          Tiến hành thanh toán <ArrowRight size={18} />
        </button>

        <div className="cart-features">
          <div className="feature">
            <Truck size={18} />
            <div>
              <h4>Miễn phí vận chuyển</h4>
              <p>Cho đơn hàng trên 5.000.000đ</p>
            </div>
          </div>
          <div className="feature">
            <Shield size={18} />
            <div>
              <h4>Bảo hành 12 tháng</h4>
              <p>Chính hãng 100%</p>
            </div>
          </div>
          <div className="feature">
            <CreditCard size={18} />
            <div>
              <h4>Thanh toán an toàn</h4>
              <p>Nhiều phương thức</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  // ===== ĐANG GIAO =====
// src/components/CartPage/CartPage.jsx
// Sửa cả 2 phần renderShippingOrders và renderDeliveredOrders

// ===== ĐANG GIAO =====
function renderShippingOrders() {
  if (ordersLoading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (shippingOrders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🚚</div>
        <h2>Không có đơn hàng đang giao</h2>
        <p>Hiện tại bạn không có đơn hàng nào đang vận chuyển</p>
      </div>
    );
  }

  return (
    <div className="orders-delivery-grid">
      {shippingOrders.map((order, idx) => {
        const status = statusMap[order.status] || statusMap['PENDING'];
        const StatusIcon = status.icon;
        
        return (
          <div key={order.id} className="delivery-card" onClick={() => setSelectedOrder(order)}>
            <div className="delivery-card-header">
              <div className="delivery-code">
                <span className="code-label">Mã đơn</span>
                <span className="code-value">#{order.orderCode}</span>
              </div>
              <div className="delivery-status" style={{ background: status.bg, color: status.color }}>
                <StatusIcon size={14} />
                {status.label}
              </div>
            </div>

            <div className="delivery-card-body">
              <div className="delivery-items">
                {order.items?.slice(0, 2).map((item) => {
                  // ✅ Lấy thông tin sản phẩm đã giải mã
                  const product = item.product || {};
                  const productImage = product.image || 'https://via.placeholder.com/40';
                  const productName = item.productName || product.name || 'Sản phẩm';
                  
                  return (
                    <div key={item.id} className="delivery-item">
                      <img src={productImage} alt={productName} />
                      <div>
                        <p className="item-name">{productName}</p>
                        <p className="item-qty">x{item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
                {order.items?.length > 2 && (
                  <div className="delivery-more">+{order.items.length - 2} sản phẩm khác</div>
                )}
              </div>

              <div className="delivery-info">
                <div className="info-row"><MapPin size={14} /><span>{order.shippingAddress}</span></div>
                <div className="info-row"><Phone size={14} /><span>{order.phoneNumber}</span></div>
                <div className="info-row"><Calendar size={14} /><span>{formatDate(order.orderedAt)}</span></div>
              </div>
            </div>

            <div className="delivery-card-footer">
              <div className="delivery-total">
                <span>Tổng tiền</span>
                <strong>{order.totalAmount?.toLocaleString()}đ</strong>
              </div>
              <div className="delivery-progress">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${
                      order.status === 'SHIPPING' ? 'shipping' : 
                      order.status === 'CONFIRMED' ? 'confirmed' : 'pending'
                    }`} 
                    style={{ 
                      width: order.status === 'SHIPPING' ? '66%' : 
                             order.status === 'CONFIRMED' ? '33%' : '10%' 
                    }}
                  ></div>
                </div>
                <div className="progress-steps">
                  <span className={order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'SHIPPING' ? 'active' : ''}>
                    {order.status === 'PENDING' ? '⏳ Chờ' : '✅ Xác nhận'}
                  </span>
                  <span className={order.status === 'CONFIRMED' || order.status === 'SHIPPING' ? 'active' : ''}>
                    {order.status === 'SHIPPING' ? '🚚 Đang giao' : 'Đang giao'}
                  </span>
                  <span className={order.status === 'SHIPPING' ? 'active' : ''}>
                    {order.status === 'SHIPPING' ? '📦 Sắp đến' : 'Đã nhận'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== ĐÃ NHẬN =====
function renderDeliveredOrders() {
  if (ordersLoading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (deliveredOrders.length === 0) {
    return (
      <motion.div className="empty-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="empty-icon">📦</div>
        <h2>Chưa có đơn hàng đã nhận</h2>
        <p>Bạn chưa có đơn hàng nào đã giao thành công</p>
      </motion.div>
    );
  }

  return (
    <div className="orders-delivered-grid">
      {deliveredOrders.map((order, idx) => {
        const status = statusMap[order.status] || statusMap['DELIVERED'];
        const StatusIcon = status.icon;
        
        return (
          <motion.div 
            key={order.id} 
            className="delivered-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setSelectedOrder(order)}
          >
            <div className="delivered-card-header">
              <div className="delivered-code">
                <span className="code-label">Mã đơn</span>
                <span className="code-value">#{order.orderCode}</span>
              </div>
              <div className="delivered-status" style={{ background: status.bg, color: status.color }}>
                <StatusIcon size={14} />
                {status.label}
              </div>
            </div>

            <div className="delivered-card-body">
              <div className="delivered-items">
                {order.items?.slice(0, 3).map((item) => {
                  const product = item.product || {};
                  const productImage = product.image || 'https://via.placeholder.com/40';
                  const productName = item.productName || product.name || 'Sản phẩm';
                  
                  return (
                    <div key={item.id} className="delivered-item">
                      <img src={productImage} alt={productName} />
                      <div>
                        <p className="item-name">{productName}</p>
                        <p className="item-qty">x{item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
                {order.items?.length > 3 && (
                  <div className="delivered-more">+{order.items.length - 3} sản phẩm khác</div>
                )}
              </div>

              <div className="delivered-info">
                <div className="info-row">
                  <MapPin size={14} />
                  <span>{order.shippingAddress}</span>
                </div>
                <div className="info-row">
                  <Calendar size={14} />
                  <span>Nhận ngày: {formatDate(order.deliveredAt || order.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="delivered-card-footer">
              <div className="delivered-total">
                <span>Tổng tiền</span>
                <strong>{order.totalAmount?.toLocaleString()}đ</strong>
              </div>
              <div className="delivered-badge">
                <CheckCircle size={16} />
                <span>Đã nhận hàng</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
}
