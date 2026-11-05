// src/components/AdminProducts/AdminProducts.jsx
import { useState, useEffect, useRef } from "react";
import { 
  Search, Plus, Edit, Trash2, RefreshCw, X, 
  PlusCircle, MinusCircle, Upload, Image as ImageIcon
} from "lucide-react";
import { api } from "../../services/api";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "PC_GAMING",
    price: "",
    discount: 0,
    stock: 0,
    image: "",
    description: "",
    specs: []
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categoryOptions = [
    { value: "PC_GAMING", label: "🖥️ PC Gaming" },
    { value: "LAPTOP", label: "💻 Laptop" },
    { value: "ACCESSORY", label: "🎮 Phụ kiện" }
  ];

  const getSpecTemplate = (category) => {
    const templates = {
      PC_GAMING: [
        { key: "CPU", value: "" },
        { key: "Mainboard", value: "" },
        { key: "RAM", value: "" },
        { key: "SSD", value: "" },
        { key: "VGA", value: "" },
        { key: "Nguồn", value: "" },
        { key: "Tản nhiệt", value: "" }
      ],
      LAPTOP: [
        { key: "CPU", value: "" },
        { key: "RAM", value: "" },
        { key: "SSD", value: "" },
        { key: "VGA", value: "" },
        { key: "Màn hình", value: "" },
        { key: "Pin", value: "" },
        { key: "Trọng lượng", value: "" }
      ],
      ACCESSORY: [
        { key: "Loại", value: "" },
        { key: "Kết nối", value: "" },
        { key: "Màu sắc", value: "" },
        { key: "Chất liệu", value: "" },
        { key: "Trọng lượng", value: "" }
      ]
    };
    return templates[category] || [];
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload/image", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      
      if (result.success) {
        const imageUrl = "http://localhost:8080" + result.filePath;
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setPreviewImage(imageUrl);
        setSuccess("✅ Tải ảnh thành công!");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(result.error || "Upload thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi upload ảnh");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const template = getSpecTemplate(category);
    setFormData({
      ...formData,
      category: category,
      specs: template
    });
    setError("");
    setSuccess("");
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const addSpecRow = () => {
    setFormData({
      ...formData,
      specs: [...formData.specs, { key: "", value: "" }]
    });
  };

  const removeSpecRow = (index) => {
    const newSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData({ ...formData, specs: newSpecs });
  };

  const resetForm = () => {
    const template = getSpecTemplate("PC_GAMING");
    setFormData({
      name: "",
      brand: "",
      category: "PC_GAMING",
      price: "",
      discount: 0,
      stock: 0,
      image: "",
      description: "",
      specs: template
    });
    setPreviewImage("");
    setEditingProduct(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên sản phẩm");
      setSubmitting(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Vui lòng nhập giá hợp lệ");
      setSubmitting(false);
      return;
    }

    try {
      const specsObject = {};
      formData.specs.forEach(item => {
        if (item.key && item.key.trim() && item.value && item.value.trim()) {
          specsObject[item.key.trim()] = item.value.trim();
        }
      });

      const productData = {
        name: formData.name,
        brand: formData.brand || "",
        category: formData.category,
        price: String(parseFloat(formData.price)),
        discount: String(parseInt(formData.discount) || 0),
        stock: String(parseInt(formData.stock) || 0),
        image: formData.image || "",
        description: formData.description || "",
        specs: JSON.stringify(specsObject),
        isNew: "true",
        isBestseller: "false",
        isOnSale: formData.discount > 0 ? "true" : "false"
      };

      console.log("📦 Sending product data:", productData);

      let result;
      if (editingProduct) {
        result = await api.updateProduct(editingProduct.id, productData);
      } else {
        result = await api.createProduct(productData);
      }

      console.log("📦 Response:", result);

      if (result.id || result.success) {
        setSuccess(editingProduct ? "✅ Cập nhật sản phẩm thành công!" : "✅ Thêm sản phẩm thành công!");
        fetchProducts();
        setTimeout(() => {
          setShowAddModal(false);
          resetForm();
        }, 1500);
      } else {
        setError(result.error || "Lưu sản phẩm thất bại");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    let specsArray = [];
    try {
      if (product.specs) {
        const specsObj = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
        specsArray = Object.keys(specsObj).map(key => ({ key, value: specsObj[key] || "" }));
      }
    } catch (e) {
      specsArray = [];
    }

    if (specsArray.length === 0) {
      specsArray = getSpecTemplate(product.category || "PC_GAMING");
    }

    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "PC_GAMING",
      price: product.price || "",
      discount: product.discount || 0,
      stock: product.stock || 0,
      image: product.image || "",
      description: product.description || "",
      specs: specsArray
    });
    setPreviewImage(product.image || "");
    setShowAddModal(true);
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: "Hết hàng", class: "out-of-stock" };
    if (stock < 5) return { text: "Sắp hết", class: "low-stock" };
    return { text: "Còn hàng", class: "in-stock" };
  };

  if (loading) {
    return <div className="admin-loading">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div className="header-left">
          <h2>🛍️ Quản lý sản phẩm</h2>
          <span className="product-count">Tổng: {products.length} sản phẩm</span>
        </div>
        <div className="admin-products-actions">
          <button className="refresh-btn" onClick={fetchProducts}>
            <RefreshCw size={18} />
            <span>Làm mới</span>
          </button>
          <button className="add-product-btn" onClick={openAddModal}>
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            ✕
          </button>
        )}
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th className="id-col">ID</th>
              <th className="image-col">Hình</th>
              <th className="product-col">Tên sản phẩm</th>
              <th className="category-col">Danh mục</th>
              <th className="price-col">Giá gốc</th>
              <th className="price-col">Giá bán</th>
              <th className="stock-col">Tồn kho</th>
              <th className="sold-col">Đã bán</th>
              <th className="action-col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Không có sản phẩm nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const stockStatus = getStockStatus(product.stock);
                const salePrice = product.discount > 0 
                  ? product.price - (product.price * product.discount / 100)
                  : product.price;
                
                return (
                  <tr key={product.id} className="product-row">
                    <td className="id-cell">
                      <div className="uuid-wrapper" title={product.id}>
                        <span className="uuid-text">{product.id}</span>
                      </div>
                    </td>
                    <td>
                      <img
                        src={product.image || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="product-thumb"
                        onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                      />
                    </td>
                    <td>
                      <div className="product-name-cell">
                        <span className="product-name">{product.name}</span>
                        {product.discount > 0 && <span className="sale-badge">-{product.discount}%</span>}
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">
                        {categoryOptions.find(c => c.value === product.category)?.label || product.category}
                      </span>
                    </td>
                    <td className="price-cell original-price">
                      {product.price?.toLocaleString()}đ
                    </td>
                    <td className={`price-cell ${product.discount > 0 ? 'sale-price' : ''}`}>
                      {salePrice.toLocaleString()}đ
                      {product.discount > 0 && (
                        <span className="discount-badge">-{product.discount}%</span>
                      )}
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className={`stock-status ${stockStatus.class}`}>
                          {stockStatus.text}
                        </span>
                        <span className="stock-number">({product.stock || 0})</span>
                      </div>
                    </td>
                    <td>
                      <span className="sold-count">{product.soldCount || 0}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(product)}
                          title="Sửa sản phẩm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteProduct(product.id)}
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa sản phẩm */}
      {showAddModal && (
        <div className="product-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <h3>{editingProduct ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {error && <div className="modal-error">{error}</div>}
            {success && <div className="modal-success">{success}</div>}

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                {/* Upload ảnh */}
                <div className="form-group full-width">
                  <label>📷 Hình ảnh sản phẩm</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="file-input"
                    />
                    <div className="upload-preview">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="preview-image" />
                      ) : (
                        <div className="upload-placeholder">
                          <ImageIcon size={40} />
                          <p>Nhấn để chọn ảnh</p>
                        </div>
                      )}
                    </div>
                    {uploading && <div className="uploading-text">Đang tải lên...</div>}
                  </div>
                  <span className="hint-text">Hỗ trợ: JPG, PNG, WEBP</span>
                </div>

                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thương hiệu</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Nhập thương hiệu"
                  />
                </div>

                <div className="form-group">
                  <label>📂 Nhóm sản phẩm *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                    className="category-select"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span className="hint-text">
                    Chọn nhóm để sản phẩm hiển thị đúng khi bấm navbar
                  </span>
                </div>

                <div className="form-group">
                  <label>💰 Giá gốc (VNĐ) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Nhập giá gốc"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>📉 Giảm giá (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  {formData.discount > 0 && (
                    <div className="price-calculator">
                      <span className="sale-price-label">
                        Giá bán: <strong>
                          {(parseFloat(formData.price) || 0) - ((parseFloat(formData.price) || 0) * parseInt(formData.discount) / 100)}đ
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>📦 Số lượng tồn kho</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="form-group full-width">
                  <label>📝 Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả sản phẩm..."
                    rows="3"
                  />
                </div>

                {/* Thông số kỹ thuật */}
                <div className="form-group full-width">
                  <div className="specs-header">
                    <label>📋 Thông số kỹ thuật</label>
                    <div className="specs-actions">
                      <button type="button" className="add-spec-btn" onClick={addSpecRow}>
                        <PlusCircle size={18} /> Thêm
                      </button>
                    </div>
                  </div>
                  
                  <div className="specs-list">
                    {formData.specs.map((spec, index) => (
                      <div key={index} className="spec-row">
                        <input
                          type="text"
                          placeholder="Tên thông số (VD: CPU)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                          className="spec-key"
                        />
                        <input
                          type="text"
                          placeholder="Giá trị (VD: Intel i9-14900K)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                          className="spec-value"
                        />
                        <button
                          type="button"
                          className="remove-spec-btn"
                          onClick={() => removeSpecRow(index)}
                          disabled={formData.specs.length <= 1}
                        >
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <span className="hint-text">
                    💡 Những thông số nào có giá trị sẽ được hiển thị trên trang sản phẩm
                  </span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Đang xử lý..." : (editingProduct ? "Cập nhật" : "Thêm sản phẩm")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
