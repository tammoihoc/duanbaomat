// src/components/ProductSlider/ProductSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCardModern from "../ProductCardModern/ProductCardModern";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ProductSlider.css";

export default function ProductSlider({ title, products, viewAllLink }) {
  // Nếu không có sản phẩm thì không hiển thị
  if (!products || products.length === 0) {
    return null;
  }

  const hasTitle = title && title.trim() !== "";

  return (
    <div className="product-slider-section">
      {hasTitle && (
        <div className="slider-header">
          <div className="slider-title-wrapper">
            <h2 className="slider-title">{title}</h2>
            <div className="title-decoration"></div>
          </div>
          <a href={viewAllLink} className="view-all-link">
            Xem tất cả →
          </a>
        </div>
      )}

      <div className="slider-wrapper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 15 },
            640: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 18 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="product-swiper"
        >
          {products.map((product, idx) => (
            <SwiperSlide key={product.id}>
              <ProductCardModern product={product} index={idx} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
