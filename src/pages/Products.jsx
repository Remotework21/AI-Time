// Products.jsx
// صفحة عرض جميع المنتجات مع البحث والفلترة + فورم الطلب
// API: https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/products.css";
import { saveGiftRegistration } from "../services/firebaseService";

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

  // Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [audienceFilter, setAudienceFilter] = useState("");

  // ماب لتحويل الكود لليبل عربي نظيف
  const AUDIENCE_LABELS = {
    audience_3: "للشركات",
    audience_4: "للأفراد",
    audience_5: "للجمعيات",
    audience_2: "للمبرمجين",
  };

  // جلب المنتجات من API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📦 Products - Fetching products...");

      let url =
        "https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts?limit=100";

      // لو فيه audience جاي من الـ URL ضيفه
      if (audienceFilter) {
        url += `&audience=${encodeURIComponent(audienceFilter)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("فشل تحميل المنتجات");
      }

      const data = await response.json();
      console.log("📊 Products - API Response:", data);

      if (data.ok && data.items) {
        setProducts(data.items);
        setFilteredProducts(data.items);

        const uniqueCategories = [
          "الكل",
          ...Array.from(
            new Set(data.items.map((p) => p.subCategory).filter(Boolean))
          ),
        ];
        setCategories(uniqueCategories);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setCategories(["الكل"]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audienceFilter]);

  useEffect(() => {
    const audienceFromUrl = searchParams.get("audience");
    if (audienceFromUrl && /^audience_\d+$/.test(audienceFromUrl)) {
      setAudienceFilter(audienceFromUrl);
    } else {
      setAudienceFilter(""); // يعني كل المنتجات
    }
  }, [searchParams]);

  // Handle form input change
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

  // Handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: "", text: "" });

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
        text: "🎉 تم إرسال طلبك بنجاح! سنتواصل معك قريباً",
      });

      setFormData({ name: "", email: "", phone: "" });

      setTimeout(() => {
        setShowOrderModal(false);
        setFormMessage({ type: "", text: "" });
      }, 2500);
    } catch (error) {
      console.error("❌ Error:", error);
      setFormMessage({
        type: "error",
        text: "حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Order Modal
  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
    setFormData({ name: "", email: "", phone: "" });
    setFormMessage({ type: "", text: "" });
  };

  // Close Order Modal
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedProduct(null);
    setFormData({ name: "", email: "", phone: "" });
    setFormMessage({ type: "", text: "" });
  };

  // Open Details Modal
  const openDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  // Close Details Modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) => {
        const audiencesText = Array.isArray(product.targetAudiences)
          ? product.targetAudiences.join(" ")
          : String(product.targetAudiences || "");

        return (
          product.name?.toLowerCase().includes(term) ||
          audiencesText.toLowerCase().includes(term) ||
          product.subCategory?.toLowerCase().includes(term)
        );
      });
    }

    if (selectedCategory !== "الكل") {
      result = result.filter((p) => p.subCategory === selectedCategory);
    }

    if (selectedStatus !== "الكل") {
      result = result.filter((p) => p.readinessStatus === selectedStatus);
    }

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

  // بطاقة المنتج المحسّنة
  const ProductCard = ({ product }) => {
    const isAvailable = product.readinessStatus === "متاح";

    // عرض أول 3 features أو sellingPoints
    const displayFeatures =
      product.features?.slice(0, 3) || product.sellingPoints?.slice(0, 3) || [];

    return (
      <div className="product-card-premium">
        <div className="card-glow"></div>

        <div className="product-header-modern">
          <div className="product-icon-wrapper">
            <div className="icon-bg-circle"></div>
            <i
              className={`fas ${getProductIcon(
                product.subCategory
              )} product-icon-modern`}
            ></i>
          </div>

          <div className="status-badge-modern">
            <span
              className={`badge-pill ${
                isAvailable ? "badge-available" : "badge-coming"
              }`}
            >
              <i
                className={`fas ${
                  isAvailable ? "fa-check-circle" : "fa-clock"
                }`}
              ></i>
              {isAvailable ? "متاح الآن" : "قريباً"}
            </span>
          </div>
        </div>

        <div className="product-body-modern">
          <div className="product-category-tag">
            <i className="fas fa-tag"></i>
            {product.subCategory || "منتجات AI"}
          </div>

          <h3 className="product-title-modern">{product.name}</h3>

          {/* <p className="product-description-modern">
            {product.targetAudiences ||
              "حلول ذكاء اصطناعي متطورة لتحسين أعمالك"}
          </p> */}

          {displayFeatures.length > 0 && (
            <div className="product-features-list">
              {displayFeatures.map((feature, index) => (
                <div key={index} className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          <div className="product-actions-modern">
            <button
              className="btn-details-modern"
              onClick={() => openDetailsModal(product)}
            >
              <span>التفاصيل</span>
              <i className="fas fa-info-circle"></i>
            </button>

            <button
              className="btn-order-modern"
              onClick={(e) => {
                e.stopPropagation();
                openOrderModal(product);
              }}
            >
              <div className="btn-shine"></div>
              <i className="fas fa-shopping-cart"></i>
              <span>اطلب الآن</span>
            </button>
          </div>
        </div>

        <div className="card-pattern"></div>
      </div>
    );
  };

  return (
    <div className="products-page">
      {/* Hero Section المحسّن */}
      <section className="products-hero-premium">
        <div className="hero-background-animation">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container hero-content-premium">
          <div className="hero-badge">
            <i className="fas fa-sparkles"></i>
            <span>اكتشف عالم الذكاء الاصطناعي</span>
          </div>

          <h1 className="hero-title-premium">
            منتجات الذكاء الاصطناعي المبتكرة
          </h1>

          <p className="hero-subtitle-premium">
            حلول متطورة تجمع بين الابتكار والتكنولوجيا لتحويل أفكارك إلى واقع
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div
                className="stat-number"
                style={{ color: "#fff", opacity: 1 }}
              >
                {filteredProducts.length}+
              </div>
              <div className="stat-label">منتج متاح</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div
                className="stat-number"
                style={{ color: "#fff", opacity: 1 }}
              >
                {products.filter((p) => p.readinessStatus === "متاح").length}
              </div>
              <div className="stat-label">جاهز للاستخدام</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div
                className="stat-number"
                style={{ color: "#fff", opacity: 1 }}
              >
                24/7
              </div>
              <div className="stat-label">دعم فني</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section المحسّن */}
      <section className="products-filters-premium">
        <div className="container">
          <div className="filters-wrapper-modern">
            <div className="search-box-modern">
              <i className="fas fa-search search-icon-modern"></i>
              <input
                type="text"
                placeholder="ابحث عن المنتج المناسب لك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-modern"
              />
              {searchTerm && (
                <button
                  className="clear-search-modern"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="filters-grid">
              <div className="filter-item-modern">
                <label className="filter-label-modern">
                  <i className="fas fa-layer-group"></i>
                  الفئة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select-modern"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item-modern">
                <label className="filter-label-modern">
                  <i className="fas fa-check-circle"></i>
                  الحالة
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select-modern"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item-modern">
                <label className="filter-label-modern">
                  <i className="fas fa-sort"></i>
                  الترتيب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select-modern"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="price-low">السعر: الأقل أولاً</option>
                  <option value="price-high">السعر: الأعلى أولاً</option>
                  <option value="name-asc">الاسم: أ - ي</option>
                </select>
              </div>
            </div>
          </div>

          <div className="results-info-modern">
            <div className="results-count-modern">
              <i className="fas fa-cube"></i>
              <span>
                {loading
                  ? "جاري التحميل..."
                  : `${filteredProducts.length} منتج متاح`}
              </span>
            </div>

            {searchTerm && (
              <div className="active-filter-badge">
                <i className="fas fa-filter"></i>
                نتائج البحث عن: "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section-premium">
        <div className="container">
          {loading && (
            <div className="loading-state-modern">
              <div className="spinner-modern">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <p className="loading-text">جاري تحميل المنتجات المذهلة...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state-modern">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>عذراً، حدث خطأ</h3>
              <p>{error}</p>
              <button className="btn-retry-modern" onClick={fetchProducts}>
                <i className="fas fa-redo"></i>
                إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state-modern">
              <div className="empty-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>
                {audienceFilter
                  ? "لا توجد منتجات لهذه الفئة حالياً"
                  : "لا توجد نتائج"}
              </h3>
              <p>
                {audienceFilter
                  ? `لا توجد حالياً منتجات متاحة ${
                      AUDIENCE_LABELS[audienceFilter] || ""
                    }. تابعنا، سنضيف المزيد قريباً.`
                  : "لم نجد منتجات تطابق معايير البحث. جرب تغيير الفلاتر."}
              </p>

              <button
                className="btn-reset-modern"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("الكل");
                  setSelectedStatus("الكل");
                  setSortBy("newest");
                  if (audienceFilter) {
                    // نرجع لصفحة كل المنتجات
                    window.location.href = "/products";
                  }
                }}
              >
                <i className="fas fa-undo"></i>
                {audienceFilter ? "عرض جميع المنتجات" : "إعادة تعيين الفلاتر"}
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid-premium">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card-container"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal التفاصيل */}
      {showDetailsModal && selectedProduct && (
        <div className="modal-overlay-premium" onClick={closeDetailsModal}>
          <div
            className="modal-content-details"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeDetailsModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header-details">
              <div className="modal-icon-wrapper">
                <div className="modal-icon-bg"></div>
                <i
                  className={`fas ${getProductIcon(
                    selectedProduct.subCategory
                  )} modal-icon`}
                ></i>
              </div>
              <h2 className="modal-title">{selectedProduct.name}</h2>
              <p className="modal-subtitle">{selectedProduct.subCategory}</p>
              <div className="modal-divider"></div>
            </div>

            <div className="modal-body-details">
              {selectedProduct.targetAudiences && (
                <div className="details-section">
                  <h3>
                    <i className="fas fa-users"></i> الفئة المستهدفة
                  </h3>
                  <p>{selectedProduct.targetAudiences}</p>
                </div>
              )}

              {selectedProduct.features &&
                selectedProduct.features.length > 0 && (
                  <div className="details-section">
                    <h3>
                      <i className="fas fa-star"></i> المميزات
                    </h3>
                    <ul className="details-list">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index}>
                          <i className="fas fa-check-circle"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProduct.sellingPoints &&
                selectedProduct.sellingPoints.length > 0 && (
                  <div className="details-section">
                    <h3>
                      <i className="fas fa-bolt"></i> نقاط البيع الرئيسية
                    </h3>
                    <ul className="details-list">
                      {selectedProduct.sellingPoints.map((point, index) => (
                        <li key={index}>
                          <i className="fas fa-arrow-left"></i>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProduct.links && selectedProduct.links.length > 0 && (
                <div className="details-section">
                  <h3>
                    <i className="fas fa-link"></i> روابط مفيدة
                  </h3>
                  <div className="links-grid">
                    {selectedProduct.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-item"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="details-section">
                <h3>
                  <i className="fas fa-info-circle"></i> معلومات إضافية
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">الحالة:</span>
                    <span className="info-value">
                      {selectedProduct.readinessStatus || "غير محدد"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">السعر:</span>
                    <span className="info-value">
                      {formatPrice(selectedProduct.customerPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="btn-order-details"
                onClick={() => {
                  closeDetailsModal();
                  openOrderModal(selectedProduct);
                }}
              >
                <i className="fas fa-shopping-cart"></i>
                <span>اطلب الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal الطلب */}
      {showOrderModal && selectedProduct && (
        <div className="modal-overlay-premium" onClick={closeOrderModal}>
          <div
            className="modal-content-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeOrderModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header-premium">
              <div className="modal-icon-wrapper">
                <div className="modal-icon-bg"></div>
                <i className="fas fa-shopping-cart modal-icon"></i>
              </div>
              <h2 className="modal-title">اطلب منتجك الآن</h2>
              <p className="modal-subtitle">{selectedProduct.name}</p>
              <div className="modal-divider"></div>
            </div>

            <form onSubmit={handleRegister} className="modal-form-premium">
              <div className="form-group-premium">
                <label className="form-label-premium">
                  <i className="fas fa-user"></i>
                  الاسم الكامل
                </label>
                <div className="input-wrapper-premium">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="form-input-premium"
                  />
                </div>
              </div>

              <div className="form-group-premium">
                <label className="form-label-premium">
                  <i className="fas fa-envelope"></i>
                  البريد الإلكتروني
                </label>
                <div className="input-wrapper-premium">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                    className="form-input-premium"
                  />
                </div>
              </div>

              <div className="form-group-premium">
                <label className="form-label-premium">
                  <i className="fas fa-phone"></i>
                  رقم الجوال
                </label>
                <div className="input-wrapper-premium">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="05xxxxxxxx"
                    required
                    pattern="^(05|5)[0-9]{8}$"
                    className="form-input-premium"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              {formMessage.text && (
                <div
                  className={`form-message-premium ${
                    formMessage.type === "success"
                      ? "message-success"
                      : "message-error"
                  }`}
                >
                  <i
                    className={`fas ${
                      formMessage.type === "success"
                        ? "fa-check-circle"
                        : "fa-exclamation-circle"
                    }`}
                  ></i>
                  <span>{formMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className="btn-submit-premium"
              >
                <div className="btn-submit-shine"></div>
                {formSubmitting ? (
                  <>
                    <div className="spinner-submit"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>إرسال الطلب</span>
                  </>
                )}
              </button>

              <p className="form-note-premium">
                <i className="fas fa-shield-alt"></i>
                سيتم التواصل معك خلال 24 ساعة
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
