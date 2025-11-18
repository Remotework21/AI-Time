// Products.jsx
// صفحة عرض جميع المنتجات مع البحث والفلترة + فورم التسجيل
// API: https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/products.css";
import { saveGiftRegistration } from "../services/firebaseService"; // ✅ استيراد دالة الحفظ

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Categories
  const [categories, setCategories] = useState(["الكل"]);
  const statuses = ["الكل", "متاح", "قريباً", "تحت التطوير"];

  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);

  // ✅ Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  // ✅ جلب المنتجات من API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📦 Products - Fetching products...");

      const response = await fetch(
        "https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts?limit=100"
      );

      if (!response.ok) {
        throw new Error("فشل تحميل المنتجات");
      }

      const data = await response.json();
      console.log("📊 Products - API Response:", data);

      if (data.ok && data.items) {
        setProducts(data.items);
        setFilteredProducts(data.items);

        // لو حابب تطلع الكاتيجوريز ديناميك من المنتجات:
        const uniqueCategories = [
          "الكل",
          ...Array.from(
            new Set(data.items.map((p) => p.subCategory).filter(Boolean))
          ),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("❌ Products - Error fetching products:", error);
      setError("فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formMessage.text) {
      setFormMessage({ type: "", text: "" });
    }
  };

  // ✅ Handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: "", text: "" });

    // Validation
    if (!formData.name.trim()) {
      setFormMessage({ type: "error", text: "الرجاء إدخال الاسم" });
      setFormSubmitting(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormMessage({
        type: "error",
        text: "الرجاء إدخال بريد إلكتروني صحيح",
      });
      setFormSubmitting(false);
      return;
    }

    if (!formData.phone.match(/^(05|5)[0-9]{8}$/)) {
      setFormMessage({
        type: "error",
        text: "رقم الجوال يجب أن يكون بصيغة: 05xxxxxxxx",
      });
      setFormSubmitting(false);
      return;
    }

    try {
      const registrationData = {
        ...formData,
        productId: selectedProduct?.id,
        productName: selectedProduct?.name,
        source: "products_page",
      };

      const result = await saveGiftRegistration(registrationData);

      console.log("🎉 تم التسجيل بنجاح! Document ID:", result.id);

      setFormMessage({
        type: "success",
        text: "🎉 تم التسجيل بنجاح! سنتواصل معك قريباً",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "" });

      // Auto close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setFormMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("❌ Error:", error);
      setFormMessage({
        type: "error",
        text: "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // ✅ Open Modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setFormData({ name: "", email: "", phone: "" });
    setFormMessage({ type: "", text: "" });
  };

  // ✅ Close Modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setFormData({ name: "", email: "", phone: "" });
    setFormMessage({ type: "", text: "" });
  };

  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...products];

    // البحث
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.targetAudiences?.toLowerCase().includes(term) ||
          product.subCategory?.toLowerCase().includes(term)
      );
    }

    // فلتر الفئة
    if (selectedCategory !== "الكل") {
      result = result.filter((p) => p.subCategory === selectedCategory);
    }

    // فلتر الحالة
    if (selectedStatus !== "الكل") {
      result = result.filter((p) => p.readinessStatus === selectedStatus);
    }

    // الترتيب
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        result.sort((a, b) => (a.customerPrice || 0) - (b.customerPrice || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.customerPrice || 0) - (a.customerPrice || 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // تنسيق السعر
  const formatPrice = (price) => {
    if (!price || price === 0) return "مجاني";
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // أيقونة المنتج حسب الفئة
  const getProductIcon = (subCategory) => {
    const icons = {
      شركات: "fa-building",
      جمعيات: "fa-hands-helping",
      أفراد: "fa-user",
      "أسر منتجة": "fa-home",
      default: "fa-robot",
    };
    return icons[subCategory] || icons.default;
  };

  // ✅ بطاقة المنتج - معدلة مع زر التسجيل
  const ProductCard = ({ product }) => {
    const isAvailable = product.readinessStatus === "متاح";
    const getReleaseDate = () => {
      if (isAvailable) return null;
      const date = new Date(product.createdAt);
      date.setMonth(date.getMonth() + 2);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
      });
    };

    return (
      <div className="product-card-new">
        {/* Header with Gradient */}
        <div className="product-header-gradient">
          <div className="product-icon-large">
            <i className={`fas ${getProductIcon(product.subCategory)}`}></i>
          </div>

          {/* Status Badge */}
          <div className="status-badge-top">
            <span
              className={`status-badge ${
                isAvailable ? "status-available" : "status-coming"
              }`}
            >
              {isAvailable ? "متاح الآن" : `قريباً - ${getReleaseDate()}`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="product-content-white">
          <h3 className="product-title-new">{product.name}</h3>
          <p className="product-description-new">
            {product.targetAudiences || "منتج ذكاء اصطناعي متطور"}
          </p>

          {/* ✅ Buttons Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "auto",
            }}
          >
            {/* زر التفاصيل */}
            <button
              className="product-action-btn"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {isAvailable ? (
                <>
                  اعرف المزيد
                  <i className="fas fa-arrow-left"></i>
                </>
              ) : (
                <>
                  قريباً
                  <i className="fas fa-clock"></i>
                </>
              )}
            </button>

            {/* ✅ زر التسجيل/الاستفسار */}
            <button
              className="product-register-btn"
              onClick={(e) => {
                e.stopPropagation();
                openModal(product);
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
            >
              <i className="fas fa-clipboard-list"></i>
              سجل اهتمامك
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-page">
      {/* Hero */}
      <section className="products-hero">
        <div className="container">
          <h1 className="hero-title">منتجات الذكاء الاصطناعي</h1>
          <p className="hero-subtitle">
            اكتشف مجموعة متنوعة من حلول الذكاء الاصطناعي
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="products-filters">
        <div className="container">
          <div className="filters-container">
            {/* Search */}
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Category */}
            <div className="filter-group">
              <label className="filter-label">الفئة:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label className="filter-label">الحالة:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label className="filter-label">الترتيب:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="name-asc">الاسم: أ - ي</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <i className="fas fa-box"></i>
            <span>
              {loading ? "جاري التحميل..." : `${filteredProducts.length} منتج`}
            </span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchProducts}>
                <i className="fas fa-redo"></i> إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>لا توجد منتجات</h3>
              <p>لم نتمكن من العثور على منتجات تطابق بحثك</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ Modal للفورم */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#666",
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "all 0.3s ease",
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  color: "white",
                  fontSize: "1.5rem",
                }}
              >
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                سجل اهتمامك
              </h2>
              <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                {selectedProduct?.name}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister}>
              {/* Name */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  <i
                    className="fas fa-user"
                    style={{ marginLeft: "0.5rem", color: "#8B5CF6" }}
                  ></i>
                  الاسم
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  <i
                    className="fas fa-envelope"
                    style={{ marginLeft: "0.5rem", color: "#8B5CF6" }}
                  ></i>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  <i
                    className="fas fa-phone"
                    style={{ marginLeft: "0.5rem", color: "#8B5CF6" }}
                  ></i>
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="05xxxxxxxx"
                  required
                  pattern="^(05|5)[0-9]{8}$"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    direction: "ltr",
                    textAlign: "right",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              {/* Message */}
              {formMessage.text && (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                    background:
                      formMessage.type === "success" ? "#d1fae5" : "#fee2e2",
                    color:
                      formMessage.type === "success" ? "#065f46" : "#991b1b",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {formMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formSubmitting}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: formSubmitting
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: formSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {formSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    إرسال
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
