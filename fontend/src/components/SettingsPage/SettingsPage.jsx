// src/components/SettingsPage/SettingsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Key, Save, ArrowLeft, 
  Eye, EyeOff, Zap, CheckCircle 
} from "lucide-react";
import { api } from "../../services/api";
import "./SettingsPage.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setProfileData({
          name: parsed.name || "",
          email: parsed.email || ""
        });
      } catch (e) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  // Cập nhật tên - CÓ CẬP NHẬT NAVBAR
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.updateUser(user.id, {
        name: profileData.name,
        email: profileData.email
      });

      if (response.id || response.success) {
        // Cập nhật user trong localStorage
        const updatedUser = { ...user, name: profileData.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // ===== QUAN TRỌNG: Dispatch event để Navbar cập nhật =====
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }));
        
        setSuccess("✅ Cập nhật thông tin thành công!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.error || "Cập nhật thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Đổi mật khẩu

const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!passwordData.currentPassword) {
        setError("Vui lòng nhập mật khẩu hiện tại");
        setLoading(false);
        return;
    }

    if (passwordData.newPassword.length < 8) {
        setError("Mật khẩu mới phải có ít nhất 8 ký tự");
        setLoading(false);
        return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            setSuccess("✅ Đổi mật khẩu thành công!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setSuccess(""), 3000);
        } else {
            setError(result.error || "Đổi mật khẩu thất bại");
        }
    } catch (err) {
        console.error("Error:", err);
        setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
        setLoading(false);
    }
};

  if (!user) return null;

  return (
    <div className="settings-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="settings-card">
          {/* Header */}
          <div className="settings-header">
            <div className="settings-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="settings-header-info">
              <h1>Cài đặt tài khoản</h1>
              <p>Quản lý thông tin cá nhân và bảo mật</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="settings-tabs">
            <button 
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => { setActiveTab("profile"); setError(""); setSuccess(""); }}
            >
              <User size={16} />
              Thông tin cá nhân
            </button>
            <button 
              className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => { setActiveTab("password"); setError(""); setSuccess(""); }}
            >
              <Key size={16} />
              Đổi mật khẩu
            </button>
          </div>

          {/* Error & Success */}
          {error && <div className="settings-error">{error}</div>}
          {success && <div className="settings-success">{success}</div>}

          {/* Tab Content - Thông tin cá nhân */}
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="settings-form">
              <div className="form-group">
                <label>
                  <User size={16} />
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
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
                  value={profileData.email}
                  disabled
                  className="disabled-input"
                />
                <span className="hint-text">📌 Email không thể thay đổi</span>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                <Save size={18} />
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          )}

          {/* Tab Content - Đổi mật khẩu */}
          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label>🔐 Mật khẩu hiện tại</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>
                <span className="hint-text">🔒 Mật khẩu phải có ít nhất 8 ký tự</span>
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                <Key size={18} />
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
