import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  Settings, LogOut, Zap, Menu, X, 
  PlusCircle, List, ChevronDown 
} from "lucide-react";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("👤 AdminLayout - User data from localStorage:", userData);
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log("👤 AdminLayout - Parsed user:", parsed);
        console.log("👤 AdminLayout - Role:", parsed.role);
        
        // Kiểm tra role (không phân biệt chữ hoa/thường)
        const userRole = parsed.role?.toUpperCase();
        
        if (userRole !== "ADMIN") {
          console.log("⛔ Không phải admin, chuyển về trang chủ");
          navigate("/");
          return;
        }
        
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user data:", e);
        navigate("/login");
      }
    } else {
      console.log("⛔ Không có user data, chuyển đến login");
      navigate("/login");
    }
  }, [navigate]);

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Tổng quan" },
    { path: "/admin/orders", icon: <ShoppingBag size={20} />, label: "Đơn hàng" },
    { path: "/admin/products", icon: <Package size={20} />, label: "Sản phẩm" },
    { path: "/admin/users", icon: <Users size={20} />, label: "Người dùng" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <Zap className="admin-logo-icon" />
            {isSidebarOpen && <span>Admin<span className="gradient-text">PC</span></span>}
          </Link>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
            {isSidebarOpen && (
              <div>
                <div className="admin-user-name">{user?.name}</div>
                <div className="admin-user-email">{user?.email}</div>
              </div>
            )}
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {menuItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
          </h1>
          <div className="admin-topbar-right">
            <span className="admin-greeting">Xin chào, {user?.name}</span>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
