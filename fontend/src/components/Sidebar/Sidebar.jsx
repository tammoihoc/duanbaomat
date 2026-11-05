import "./Sidebar.css";

const menuItems = [
  "Laptop",
  "Laptop Gaming",
  "PC GVN",
  "Main, CPU, VGA",
  "Case, Nguồn, Tản",
  "Ổ cứng, RAM, Thẻ nhớ",
  "Màn hình",
  "Bàn phím",
  "Chuột + Lót chuột",
  "Tai Nghe",
  "Ghế - Bàn",
  "Phụ kiện",
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>📁 DANH MỤC SẢN PHẨM</h3>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            {item}
          </li>
        ))}
      </ul>

      <div className="sidebar-banner">
        <div className="banner-content">
          <span className="banner-tag">HOT</span>
          <h4>Build PC</h4>
          <p>Giảm đến 26%</p>
          <button>Xem ngay →</button>
        </div>
      </div>
    </div>
  );
}
