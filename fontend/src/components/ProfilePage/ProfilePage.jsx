// src/components/ProfilePage/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";  // THÊM Link vào import
import { User, Mail, Zap, Save, ArrowLeft, Key } from "lucide-react";
import { api } from "../../services/api";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setFormData({
          name: parsed.name || "",
          email: parsed.email || "",
        });
      } catch (e) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
      });

      if (response.id || response.success) {
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess("✅ Cập nhật thông tin thành công!");
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(response.error || "Cập nhật thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const isOAuthUser = !user?.password || user?.googleId || user?.facebookId;

  return (
    <div className="profile-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
            <h1>Thông tin cá nhân</h1>
            <p>Quản lý thông tin tài khoản của bạn</p>
          </div>

          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>
                <User size={16} />
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
                className="disabled-input"
              />
              <span className="hint-text">Email không thể thay đổi</span>
            </div>

            {isOAuthUser && (
              <div className="oauth-notice">
                <Zap size={16} />
                <span>
                  Tài khoản đăng nhập bằng {user?.googleId ? "Google" : "Facebook"}.
                  Chỉ có thể thay đổi tên hiển thị.
                </span>
              </div>
            )}

            <button type="submit" className="save-btn" disabled={loading}>
              <Save size={18} />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>

          <div className="profile-actions">
            <Link to="/change-password" className="change-password-link">
              <Key size={16} />
              Đổi mật khẩu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
