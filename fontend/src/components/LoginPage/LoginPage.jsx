// src/components/LoginPage/LoginPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Zap, Star, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [shake, setShake] = useState(false); // Thêm state shake
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [forgotData, setForgotData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
    setShake(false);

    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("❌ Email không hợp lệ (example@domain.com)");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value && value.length < 8) {
        setPasswordError("❌ Mật khẩu phải có ít nhất 8 ký tự");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData({ ...forgotData, [name]: value });
    setError("");
    setSuccess("");
  };

  // ===== HANDLE LOGIN =====
// Trong LoginPage.jsx, sửa phần handleSubmit login

// ===== HANDLE LOGIN =====
// src/components/LoginPage/LoginPage.jsx
// Sửa phần handleSubmit

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setShake(false);

  if (!validateEmail(formData.email)) {
    setError("❌ Email không hợp lệ");
    setShake(true);
    setLoading(false);
    return;
  }

  if (!validatePassword(formData.password)) {
    setError("❌ Mật khẩu phải có ít nhất 8 ký tự");
    setShake(true);
    setLoading(false);
    return;
  }

  try {
    if (isLogin) {
      const result = await api.login(formData.email, formData.password);
      console.log("🔐 Login response:", result);
      
      if (result.success) {
        // Lưu user vào localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        
        // Kiểm tra role (đã được giải mã từ backend)
        const userRole = result.user.role?.toUpperCase();
        console.log("👤 User role:", userRole);
        
        if (userRole === "ADMIN") {
          console.log("🚀 Chuyển hướng đến /admin");
          // Dispatch event để cập nhật navbar
          window.dispatchEvent(new CustomEvent("userUpdated", { detail: result.user }));
          navigate("/admin");
        } else {
          console.log("🏠 Chuyển hướng đến trang chủ");
          navigate("/");
        }
      } else {
        setError("❌ Email hoặc mật khẩu không đúng");
        setShake(true);
      }
    } else {
      // Register
      const result = await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (result.success) {
        setSuccess("✅ Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          setSuccess("");
        }, 2000);
      } else {
        setError(result.error || "❌ Đăng ký thất bại");
        setShake(true);
      }
    }
  } catch (err) {
    console.error("Error:", err);
    setError("❌ Có lỗi xảy ra, vui lòng thử lại");
    setShake(true);
  } finally {
    setLoading(false);
  }
};
  // ===== BƯỚC 1: KIỂM TRA EMAIL =====
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setShake(false);

    if (!validateEmail(forgotData.email)) {
      setError("❌ Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      setShake(true);
      setLoading(false);
      return;
    }

    try {
      const result = await api.checkEmailExists(forgotData.email);
      
      if (result.exists) {
        setSuccess("✅ Email hợp lệ! Vui lòng nhập mật khẩu mới.");
        setForgotStep(2);
        setError("");
      } else {
        setError("❌ Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại.");
        setShake(true);
      }
    } catch (err) {
      setError("❌ Có lỗi xảy ra, vui lòng thử lại");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  // ===== BƯỚC 2: ĐẶT LẠI MẬT KHẨU =====
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setShake(false);

    if (!validatePassword(forgotData.newPassword)) {
      setError("❌ Mật khẩu phải có ít nhất 8 ký tự");
      setShake(true);
      setLoading(false);
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setError("❌ Mật khẩu xác nhận không khớp");
      setShake(true);
      setLoading(false);
      return;
    }

    try {
      const result = await api.resetPassword(
        forgotData.email,
        forgotData.newPassword
      );

      if (result.success) {
        setSuccess("✅ Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          setIsForgotPassword(false);
          setForgotStep(1);
          setForgotData({ email: "", newPassword: "", confirmPassword: "" });
          setSuccess("");
          setIsLogin(true);
        }, 2000);
      } else {
        setError(result.error || "❌ Đặt lại mật khẩu thất bại");
        setShake(true);
      }
    } catch (err) {
      setError("❌ Có lỗi xảy ra, vui lòng thử lại");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div 
        className="cursor-glow"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      />

      <motion.button 
        className="back-home-btn"
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05, x: -5 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Quay lại</span>
      </motion.button>

      <div className="particles">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 5}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`
          }} />
        ))}
      </div>

      <div className="login-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="login-card-wrapper"
        >
          <div className="login-card-glow"></div>
          <div className={`login-card ${shake ? "shake" : ""}`}>
            <div className="card-logo">
              <Zap className="card-logo-icon" />
              <span>Shop<span className="gradient-text">PC</span></span>
            </div>

            <div className="logo-decoration">
              <div className="line"></div>
              <Star size={12} className="star" />
              <div className="line"></div>
            </div>

            {error && <div className="error-message"><span>⚠️ {error}</span></div>}
            {success && <div className="success-message"><span>✅ {success}</span></div>}

            {isForgotPassword ? (
              <>
                <div className="forgot-header">
                  <KeyRound size={28} className="forgot-icon" />
                  <h3>Quên mật khẩu</h3>
                  <p>
                    {forgotStep === 1 
                      ? "Vui lòng nhập email để kiểm tra tài khoản" 
                      : "Nhập mật khẩu mới cho tài khoản của bạn"}
                  </p>
                </div>

                <div className="forgot-progress">
                  <div className={`progress-step ${forgotStep >= 1 ? "active" : ""}`}>
                    <span className="step-num">1</span>
                    <span className="step-label">Email</span>
                  </div>
                  <div className={`progress-line ${forgotStep >= 2 ? "active" : ""}`}></div>
                  <div className={`progress-step ${forgotStep >= 2 ? "active" : ""}`}>
                    <span className="step-num">2</span>
                    <span className="step-label">Mật khẩu mới</span>
                  </div>
                </div>

                {forgotStep === 1 && (
                  <form onSubmit={handleCheckEmail} className="login-form">
                    <div className="input-group">
                      <Mail size={18} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Nhập email đã đăng ký"
                        value={forgotData.email}
                        onChange={handleForgotChange}
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="login-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      <span>{loading ? "Đang kiểm tra..." : "Kiểm tra email"}</span>
                      {!loading && <ArrowRight size={18} />}
                    </motion.button>

                    <button
                      type="button"
                      className="back-to-login"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setForgotStep(1);
                        setForgotData({ email: "", newPassword: "", confirmPassword: "" });
                        setError("");
                        setSuccess("");
                      }}
                    >
                      ← Quay lại đăng nhập
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleResetPassword} className="login-form">
                    <div className="input-group">
                      <Lock size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                        value={forgotData.newPassword}
                        onChange={handleForgotChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="input-group">
                      <Lock size={18} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu mới"
                        value={forgotData.confirmPassword}
                        onChange={handleForgotChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      className="login-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      <span>{loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}</span>
                      {!loading && <ArrowRight size={18} />}
                    </motion.button>

                    <button
                      type="button"
                      className="back-to-login"
                      onClick={() => {
                        setForgotStep(1);
                        setForgotData({ ...forgotData, newPassword: "", confirmPassword: "" });
                        setError("");
                        setSuccess("");
                      }}
                    >
                      ← Quay lại nhập email
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
                <div className="login-toggle">
                  <motion.button
                    className={`toggle-btn ${isLogin ? "active" : ""}`}
                    onClick={() => { setIsLogin(true); setError(""); setSuccess(""); setShake(false); }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Đăng nhập
                  </motion.button>
                  <motion.button
                    className={`toggle-btn ${!isLogin ? "active" : ""}`}
                    onClick={() => { setIsLogin(false); setError(""); setSuccess(""); setShake(false); }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Đăng ký
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={isLogin ? "login" : "register"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="login-form"
                  >
                    {!isLogin && (
                      <div className="input-group">
                        <User size={18} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Họ và tên"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    )}

                    <div className="input-group">
                      <Mail size={18} />
                      <input
                        type="text"
                        name="email"
                        placeholder="Email (example@domain.com)"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {emailError && <div className="error-message-small">{emailError}</div>}

                    <div className="input-group">
                      <Lock size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordError && <div className="error-message-small">{passwordError}</div>}

                    {!isLogin && (
                      <div className="input-group">
                        <Lock size={18} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Xác nhận mật khẩu"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    )}

                    {isLogin && (
                      <div className="forgot-password">
                        <button
                          type="button"
                          className="forgot-password-btn"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setForgotStep(1);
                            setForgotData({ email: "", newPassword: "", confirmPassword: "" });
                            setError("");
                            setSuccess("");
                          }}
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      className="login-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      <span>{loading ? "Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký")}</span>
                      {!loading && <ArrowRight size={18} />}
                    </motion.button>
                  </motion.form>
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
