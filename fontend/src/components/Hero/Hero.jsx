// src/components/Hero/Hero.jsx
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Award, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Video Background */}
      <div className="hero-video">
        <video autoPlay loop muted playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-background-3315-large.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <Sparkles size={18} />
            <span>🔥 WEB 5.0 - TƯƠNG LAI CÔNG NGHỆ 🔥</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            BUILD YOUR
            <span className="gradient-text"> DREAM PC</span>
            <div className="title-glow"></div>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-description"
          >
            Trải nghiệm sức mạnh của thế hệ PC mới nhất với cấu hình tối ưu,
            hiệu năng vượt trội và thiết kế đột phá
          </motion.p>

          {/* Buttons - Chỉ còn 1 nút */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-buttons"
          >
            <button 
              className="btn-primary"
              onClick={() => navigate("/pc-gaming")}
            >
              BUILD PC NGAY <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-stats"
          >
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <h4>50,000+</h4>
                <p>Khách hàng</p>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h4>98%</h4>
                <p>Hiệu năng</p>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon">🛡️</div>
              <div className="stat-info">
                <h4>24/7</h4>
                <p>Hỗ trợ</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Product Showcase */}
        <div className="hero-showcase">
          <div className="showcase-card showcase-card-1">
            <div className="card-glow-bg"></div>
            <div className="card-icon">🚀</div>
            <div className="card-text">
              <h3>HIGH PERFORMANCE</h3>
              <p>RTX 5090 | Intel Ultra 9</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
          
          <div className="showcase-card showcase-card-2">
            <div className="card-glow-bg"></div>
            <div className="card-icon">💎</div>
            <div className="card-text">
              <h3>PREMIUM QUALITY</h3>
              <p>Linh kiện cao cấp nhất</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
          
          <div className="showcase-card showcase-card-3">
            <div className="card-glow-bg"></div>
            <div className="card-icon">✨</div>
            <div className="card-text">
              <h3>NEXT GEN TECH</h3>
              <p>Công nghệ đột phá</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="price-tag">
            <span className="price-label">Khuyến mãi đặc biệt</span>
            <span className="price-value">-30%</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Scroll down</span>
        <div className="scroll-mouse"></div>
      </div>
    </section>
  );
}
