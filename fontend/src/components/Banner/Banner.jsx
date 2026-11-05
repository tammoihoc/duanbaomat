import "./Banner.css";

export default function Banner() {
  return (
    <div className="banner-main">
      <div className="banner-content">
        <div className="banner-text">
          <span className="banner-badge">🔥 SIÊU KHUYẾN MÃI</span>
          <h2>Build PC</h2>
          <p className="banner-desc">Tặng ngay màn hình 240Hz</p>
          <div className="banner-offer">
            <span className="offer-percent">GIẢM ĐẾN 51%</span>
          </div>
          <button className="banner-btn">Xem ngay →</button>
        </div>
        <div className="banner-image">
          <div className="pc-image">🖥️</div>
        </div>
      </div>
    </div>
  );
}
