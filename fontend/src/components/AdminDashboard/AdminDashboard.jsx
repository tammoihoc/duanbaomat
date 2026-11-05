// src/components/AdminDashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { ShoppingBag, Package, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { api } from "../../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const orders = await api.getAllOrders();
      const products = await api.getAllProducts();
      const users = await api.getAllUsers();
      
      const pending = orders.filter(o => o.status === "PENDING").length;
      const delivered = orders.filter(o => o.status === "DELIVERED").length;
      const cancelled = orders.filter(o => o.status === "CANCELLED").length;
      const revenue = orders
        .filter(o => o.status === "DELIVERED")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalRevenue: revenue,
        pendingOrders: pending,
        deliveredOrders: delivered,
        cancelledOrders: cancelled
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: <ShoppingBag size={24} />, label: "Tổng đơn hàng", value: stats.totalOrders, color: "#3b82f6" },
    { icon: <Package size={24} />, label: "Sản phẩm", value: stats.totalProducts, color: "#8b5cf6" },
    { icon: <Users size={24} />, label: "Người dùng", value: stats.totalUsers, color: "#10b981" },
    { icon: <DollarSign size={24} />, label: "Doanh thu", value: stats.totalRevenue.toLocaleString() + "đ", color: "#f59e0b" },
  ];

  const statusCards = [
    { icon: <Clock size={20} />, label: "Chờ xác nhận", value: stats.pendingOrders, color: "#f59e0b" },
    { icon: <CheckCircle size={20} />, label: "Đã giao", value: stats.deliveredOrders, color: "#10b981" },
    { icon: <XCircle size={20} />, label: "Đã hủy", value: stats.cancelledOrders, color: "#ef4444" },
  ];

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Tổng quan</h2>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
            <div className="stat-icon" style={{ background: stat.color + "20", color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="status-title">Trạng thái đơn hàng</h3>
      <div className="status-grid">
        {statusCards.map((item, index) => (
          <div key={index} className="status-card" style={{ borderColor: item.color }}>
            <div className="status-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div>
              <div className="status-label">{item.label}</div>
              <div className="status-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
