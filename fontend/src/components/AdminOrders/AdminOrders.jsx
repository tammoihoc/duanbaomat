// src/components/AdminOrders/AdminOrders.jsx
import { useState, useEffect } from "react";
import { Search, Eye, RefreshCw, CheckCircle, XCircle, Truck, Clock, DollarSign } from "lucide-react";
import { api } from "../../services/api";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
    totalUnpaid: 0
  });

  const statusOptions = ["ALL", "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];
  const statusLabels = {
    PENDING: "⏳ Chờ xác nhận",
    CONFIRMED: "✅ Đã xác nhận",
    SHIPPING: "🚚 Đang giao",
    DELIVERED: "📦 Đã giao",
    CANCELLED: "❌ Đã hủy"
  };
  const statusColors = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    SHIPPING: "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444"
  };
  const paymentStatusLabels = {
    PAID: "✅ Đã thanh toán",
    UNPAID: "⏳ Chưa thanh toán"
  };
  const paymentStatusColors = {
    PAID: "#10b981",
    UNPAID: "#ef4444"
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders();
      console.log("📋 Orders data:", data);
      setOrders(Array.isArray(data) ? data : []);
      calculateStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

const calculateStats = (ordersData) => {
  const total = ordersData.length;
  const pending = ordersData.filter(o => o.status === "PENDING").length;
  const confirmed = ordersData.filter(o => o.status === "CONFIRMED").length;
  const shipping = ordersData.filter(o => o.status === "SHIPPING").length;
  const delivered = ordersData.filter(o => o.status === "DELIVERED").length;
  const cancelled = ordersData.filter(o => o.status === "CANCELLED").length;
  
  // ✅ CHỈ tính doanh thu từ đơn hàng DELIVERED và PAID
  const revenue = ordersData
    .filter(o => o.status === "DELIVERED" && o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
  // ✅ Tính tổng tiền chưa thanh toán (KHÔNG tính cancelled)
  const totalUnpaid = ordersData
    .filter(o => o.paymentStatus === "UNPAID" && o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
  setStats({ total, pending, confirmed, shipping, delivered, cancelled, revenue, totalUnpaid });
};

  const updateOrderStatus = async (orderId, status) => {
    try {
      const result = await api.updateOrderStatus(orderId, status);
      console.log("📋 Update status result:", result);
      if (result.success) {
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const result = await api.updatePaymentStatus(orderId, paymentStatus);
      console.log("📋 Update payment result:", result);
      if (result.success) {
        fetchOrders();
      } else {
        alert(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Có lỗi xảy ra khi cập nhật thanh toán");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.recipientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === "ALL" || order.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <div className="admin-loading">⏳ Đang tải đơn hàng...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h2>📋 Quản lý đơn hàng</h2>
        <button className="refresh-btn" onClick={fetchOrders}>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Stats Cards */}
<div className="admin-stats-grid">
  <div className="stat-card">
    <div className="stat-icon total">📦</div>
    <div className="stat-info">
      <span className="stat-number">{stats.total}</span>
      <span className="stat-label">Tổng đơn hàng</span>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon pending">⏳</div>
    <div className="stat-info">
      <span className="stat-number">{stats.pending}</span>
      <span className="stat-label">Chờ xác nhận</span>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon confirmed">✅</div>
    <div className="stat-info">
      <span className="stat-number">{stats.confirmed}</span>
      <span className="stat-label">Đã xác nhận</span>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon shipping">🚚</div>
    <div className="stat-info">
      <span className="stat-number">{stats.shipping}</span>
      <span className="stat-label">Đang giao</span>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon delivered">✅</div>
    <div className="stat-info">
      <span className="stat-number">{stats.delivered}</span>
      <span className="stat-label">Đã giao</span>
    </div>
  </div>
  <div className="stat-card cancelled">
    <div className="stat-icon">❌</div>
    <div className="stat-info">
      <span className="stat-number">{stats.cancelled}</span>
      <span className="stat-label">Đã hủy</span>
    </div>
  </div>
  <div className="stat-card revenue">
    <div className="stat-icon">💰</div>
    <div className="stat-info">
      <span className="stat-number">{stats.revenue.toLocaleString()}đ</span>
      <span className="stat-label">Doanh thu</span>
    </div>
  </div>
  <div className="stat-card unpaid">
    <div className="stat-icon">💳</div>
    <div className="stat-info">
      <span className="stat-number">{stats.totalUnpaid.toLocaleString()}đ</span>
      <span className="stat-label">Chưa thanh toán</span>
    </div>
  </div>
</div>

      <div className="admin-orders-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          {statusOptions.map(status => (
            <button
              key={status}
              className={`filter-btn ${selectedStatus === status ? "active" : ""}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status === "ALL" ? "📋 Tất cả" : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
<tbody>
  {filteredOrders.length === 0 ? (
    <tr>
      <td colSpan="8" className="no-data">📭 Không có đơn hàng nào</td>
    </tr>
  ) : (
    filteredOrders.map(order => {
      const isCancelled = order.status === "CANCELLED";
      
      return (
        <tr key={order.id} className={isCancelled ? "cancelled-row" : ""}>
          <td><strong>#{order.orderCode}</strong></td>
          <td>{order.recipientName}</td>
          <td>{order.phoneNumber}</td>
          <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {order.shippingAddress}
          </td>
          <td>
            <strong className={isCancelled ? "cancelled-price" : ""}>
              {order.totalAmount?.toLocaleString()}đ
            </strong>
          </td>
          <td>
            <div className="payment-control">
              <span className={`payment-badge ${order.paymentStatus === "PAID" ? "paid" : "unpaid"}`}>
                {order.paymentStatus === "PAID" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
              </span>
              {!isCancelled && (
                <button
                  className="toggle-payment-btn"
                  onClick={() => updatePaymentStatus(
                    order.id,
                    order.paymentStatus === "PAID" ? "UNPAID" : "PAID"
                  )}
                  title={order.paymentStatus === "PAID" ? "Đánh dấu chưa thanh toán" : "Xác nhận đã thanh toán"}
                >
                  {order.paymentStatus === "PAID" ? "↩️" : "✅"}
                </button>
              )}
            </div>
          </td>
          <td>
            <div className="status-control">
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
          </td>
          <td>
            <div className="action-control">
              {isCancelled ? (
                <span className="cancelled-label">❌ Đã hủy</span>
              ) : (
                <>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    {statusOptions.filter(s => s !== "ALL").map(s => (
                      <option key={s} value={s}>
                        {s === "PENDING" ? "⏳ Chờ xác nhận" :
                         s === "CONFIRMED" ? "✅ Đã xác nhận" :
                         s === "SHIPPING" ? "🚚 Đang giao" :
                         s === "DELIVERED" ? "📦 Đã giao" :
                         "❌ Đã hủy"}
                      </option>
                    ))}
                  </select>
                  <button
                    className="view-detail-btn"
                    onClick={() => setSelectedOrder(order)}
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>
        </table>
      </div>

      {/* Modal chi tiết đơn hàng */}

{/* Modal chi tiết đơn hàng */}
{selectedOrder && (
  <div className="order-modal" onClick={() => setSelectedOrder(null)}>
    <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
      <h3>📋 Chi tiết đơn hàng #{selectedOrder.orderCode}</h3>
      
      <div className="order-detail-grid">
        <div><strong>Khách hàng:</strong> {selectedOrder.recipientName}</div>
        <div><strong>SĐT:</strong> {selectedOrder.phoneNumber}</div>
        <div><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</div>
        <div><strong>Thanh toán:</strong> {selectedOrder.paymentMethod === "CASH" ? "💵 Tiền mặt" : "🏦 Chuyển khoản"}</div>
        <div><strong>Trạng thái thanh toán:</strong> {selectedOrder.paymentStatus === "PAID" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}</div>
        <div><strong>Trạng thái đơn hàng:</strong> {statusLabels[selectedOrder.status]}</div>
        <div><strong>Tổng tiền:</strong> <strong style={{ color: '#ff3b5c' }}>{selectedOrder.totalAmount?.toLocaleString()}đ</strong></div>
        <div><strong>Ngày đặt:</strong> {new Date(selectedOrder.orderedAt).toLocaleString("vi-VN")}</div>
      </div>
      
      {selectedOrder.note && (
        <div className="order-note"><strong>📝 Ghi chú:</strong> {selectedOrder.note}</div>
      )}
      
      <div className="order-items-detail">
        <h4>🛍️ Sản phẩm:</h4>
        {selectedOrder.items?.length > 0 ? (
          selectedOrder.items.map((item, idx) => {
            // ✅ Lấy tên sản phẩm từ product hoặc productName
            const productName = item.product?.name || item.productName || 'Sản phẩm';
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            
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
    </div>
  </div>
)}
    </div>
  );
}
