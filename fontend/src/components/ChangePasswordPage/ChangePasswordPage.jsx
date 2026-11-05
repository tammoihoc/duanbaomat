// src/components/ChangePasswordPage/ChangePasswordPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";  // THÊM Link vào import
import { Key, Eye, EyeOff, ArrowLeft, Save } from "lucide-react";
import { api } from "../../services/api";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        if (parsed.googleId || parsed.facebookId || !parsed.password) {
          navigate("/profile");
        }
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

    if (formData.newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    try {
      const response = await api.changePassword({
        userId: user.id,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        setSuccess("✅ Đổi mật khẩu thành công!");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setError(response.error || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="change-password-card">
          <div className="change-password-header">
            <Key size={32} className="header-icon" />
            <h1>Đổi mật khẩu</h1>
            <p>Bảo mật tài khoản của bạn</p>
          </div>

          {error && <div className="cp-error">{error}</div>}
          {success && <div className="cp-success">{success}</div>}

          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-group">
              <label>Mật khẩu cũ</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mật khẩu cũ"
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
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            <button type="submit" className="save-btn" disabled={loading}>
              <Save size={18} />
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
