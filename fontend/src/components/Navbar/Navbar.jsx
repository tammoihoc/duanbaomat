// src/components/Navbar/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ShoppingBag, User, Search, Zap, 
  LogOut, Settings, ChevronDown 
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { api } from "../../services/api";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Xử lý scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleUserUpdate = (event) => {
      if (event.detail) {
        setUser(event.detail);
        // Cập nhật lại localStorage
        localStorage.setItem("user", JSON.stringify(event.detail));
      }
    };
    
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);
  // Lấy user và số lượng giỏ hàng
  useEffect(() => {
    setIsOpen(false);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        fetchCartCount(parsed.id);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
      setCartCount(0);
    }
  }, [location]);

  // Lắng nghe sự kiện cập nhật giỏ hàng
  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        fetchCartCount(user.id);
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [user]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy số lượng giỏ hàng
const fetchCartCount = async (userId) => {
    if (!userId) return;
    try {
        const data = await api.getCart(userId);
        if (data && data.totalItems !== undefined) {
            setCartCount(data.totalItems);
        } else {
            setCartCount(0);
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
    }
};

  // ===== TÌM KIẾM =====
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      setShowSuggestions(true);
      setIsSearching(true);
      
      try {
        const products = await api.getAllProducts();
        const results = products.filter(p => 
          p.name?.toLowerCase().includes(value.toLowerCase()) ||
          p.brand?.toLowerCase().includes(value.toLowerCase())
        );
        setSearchSuggestions(results.slice(0, 5)); // Chỉ lấy 5 gợi ý đầu
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "PC Gaming", path: "/pc-gaming" },
    { name: "Laptop", path: "/laptop" },
    { name: "Phụ kiện", path: "/phu-kien" },
    { name: "Khuyến mãi", path: "/khuyen-mai" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <Zap className="logo-icon" />
          <span className="logo-text">Shop<span className="gradient-text">PC</span></span>
        </Link>

        {/* Search Bar */}
        <div className="search-wrapper" ref={searchRef}>
          <div className="search-bar">
            <Search size={18} onClick={handleSearch} className="search-icon-btn" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={() => searchTerm.trim().length > 0 && setShowSuggestions(true)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => {
                setSearchTerm("");
                setShowSuggestions(false);
                setSearchSuggestions([]);
              }}>
                ✕
              </button>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((product) => (
                <div 
                  key={product.id} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{product.name}</span>
                    <span className="suggestion-price">{product.price.toLocaleString()}đ</span>
                  </div>
                </div>
              ))}
              <div className="suggestion-see-all" onClick={handleSearch}>
                🔍 Xem tất cả kết quả cho "{searchTerm}"
              </div>
            </div>
          )}
        </div>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-link ${isActive(item.path) ? "active" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-icons">
          <ThemeToggle />
          
          {/* User Menu */}
          <div className="user-menu" ref={dropdownRef}>
            {user ? (
              <button 
                className="user-avatar-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <span className="user-name">{user.name}</span>
                <ChevronDown className={`dropdown-chevron ${isDropdownOpen ? "open" : ""}`} size={16} />
              </button>
            ) : (
              <Link to="/login" className="nav-icon-link">
                <User size={20} />
              </Link>
            )}

            {user && (
              <div className={`user-dropdown ${isDropdownOpen ? "active" : ""}`}>
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                    {user.role === "ADMIN" && (
                      <span className="dropdown-badge-admin">🛡️ Admin</span>
                    )}
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                
                {user?.role === "ADMIN" && (
                  <>
                    <Link to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <span>📊</span>
                      <span>Admin Dashboard</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                  </>
                )}
                
                <Link to="/settings" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <Settings size={18} />
                  <span>Cài đặt</span>
                </Link>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          <Link to="/cart" className="nav-icon-link cart-icon">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
          
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className="mobile-link" onClick={() => setIsOpen(false)}>
            {item.name}
          </Link>
        ))}
        <div className="mobile-search">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        {user ? (
          <>
            <Link to="/settings" className="mobile-link" onClick={() => setIsOpen(false)}>
              ⚙️ Cài đặt
            </Link>
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="mobile-link" onClick={() => setIsOpen(false)}>
                📊 Admin Dashboard
              </Link>
            )}
            <button className="mobile-link logout-btn" onClick={handleLogout}>
              🚪 Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>
            🔑 Đăng nhập
          </Link>
        )}
        <Link to="/cart" className="mobile-link" onClick={() => setIsOpen(false)}>
          🛒 Giỏ hàng {cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </nav>
  );
}
