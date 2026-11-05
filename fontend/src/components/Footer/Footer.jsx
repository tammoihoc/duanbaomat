// src/components/Footer/Footer.jsx
import { MapPin, Phone, Mail, Zap } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <Zap className="footer-logo-icon" /> {/* Đổi class cho đúng */}
              <span className="footer-logo-text">Shop<span className="gradient-text">PC</span></span>
            </div>
            <p className="footer-desc">
              Đẳng cấp công nghệ - Giá trị bền vững
            </p>
            <div className="social-icons">
              <FaFacebook size={20} />
              <FaTwitter size={20} />
              <FaInstagram size={20} />
              <FaYoutube size={20} />
            </div>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo hành</li>
              <li>Phương thức thanh toán</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Về chúng tôi</h4>
            <ul>
              <li>Giới thiệu</li>
              <li>Tuyển dụng</li>
              <li>Tin tức</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li><Phone size={14} /> 1900 1234</li>
              <li><Mail size={14} /> support@shoppc.com</li>
              <li><MapPin size={14} /> 123 Nguyễn Trãi, Hà Nội</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 ShopPC. All rights reserved. | Built with ❤️ for the future</p>
        </div>
      </div>
    </footer>
  );
}
