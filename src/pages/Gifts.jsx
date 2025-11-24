// Gifts.jsx
// صفحة عرض جميع الهدايا - محسنة بالكامل
// API: https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiGifts

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/gifts.css";
import { saveGiftRegistration } from "../services/firebaseService";

// Gift Card Component - منفصل ومحسن
const GiftCard = ({ gift, onRedeem }) => {
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description =
    gift.description || gift.purpose || "هدية مميزة من منصة وقت الذكاء";
  const shortDescription =
    description.length > 120
      ? description.substring(0, 120) + "..."
      : description;
  const hasMoreContent = description.length > 120;

  const handleCardClick = () => {
    navigate(`/gift/${gift.id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onRedeem(gift); // فتح مودال طلب الهدية
  };

  const toggleDescription = (e) => {
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="gift-card-new" onClick={handleCardClick}>
      {/* Header with Gradient */}
      <div className="gift-header-gradient">
        <div className="gift-icon-large">
          <i className="fas fa-gift"></i>
        </div>

        {/* Status Badge */}
        <div className="status-badge-top">
          <span className="status-badge status-gift">
            <i className="fas fa-star"></i>
            هدية مجانية
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="gift-content-white">
        <h3 className="gift-title-new">{gift.giftName}</h3>

        {/* Description with Fixed Height */}
        <div className="gift-description-container">
          <p
            className={`gift-description-new ${
              showFullDescription ? "expanded" : ""
            }`}
          >
            {showFullDescription ? description : shortDescription}
          </p>

          {/* Show More Button */}
          {hasMoreContent && (
            <button className="gift-show-more-btn" onClick={toggleDescription}>
              {showFullDescription ? (
                <>
                  <i className="fas fa-chevron-up"></i>
                  عرض أقل
                </>
              ) : (
                <>
                  <i className="fas fa-chevron-down"></i>
                  عرض المزيد
                </>
              )}
            </button>
          )}
        </div>

        {/* Action Button - Fixed at Bottom */}
        <button className="gift-action-btn" onClick={handleButtonClick}>
          احصل على هديتك الآن
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
    </div>
  );
};

const Gifts = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Modal + Form State
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [giftFormData, setGiftFormData] = useState({
    name: "",
    phone: "",
  });
  const [giftFormSubmitting, setGiftFormSubmitting] = useState(false);
  const [giftFormMessage, setGiftFormMessage] = useState({
    type: "",
    text: "",
  });

  // API: جلب الهدايا من Firebase
  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiGifts?limit=200"
      );

      if (!response.ok) {
        throw new Error("فشل تحميل الهدايا");
      }

      const data = await response.json();

      if (data.ok && data.items) {
        setGifts(data.items);
        setFilteredGifts(data.items);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الهدايا");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...gifts];

    // البحث
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (gift) =>
          gift.giftName?.toLowerCase().includes(term) ||
          gift.description?.toLowerCase().includes(term) ||
          gift.purpose?.toLowerCase().includes(term)
      );
    }

    // الترتيب
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        result.sort((a, b) => a.giftName.localeCompare(b.giftName, "ar"));
        break;
      case "name-desc":
        result.sort((a, b) => b.giftName.localeCompare(a.giftName, "ar"));
        break;
      default:
        break;
    }

    setFilteredGifts(result);
  }, [gifts, searchTerm, sortBy]);

  // Modal handlers
  const openGiftModal = (gift) => {
    setSelectedGift(gift);
    setShowGiftModal(true);
    setGiftFormData({ name: "", phone: "" });
    setGiftFormMessage({ type: "", text: "" });
  };

  const closeGiftModal = () => {
    setShowGiftModal(false);
    setSelectedGift(null);
    setGiftFormData({ name: "", phone: "" });
    setGiftFormMessage({ type: "", text: "" });
  };

  const handleGiftInputChange = (e) => {
    const { name, value } = e.target;
    setGiftFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (giftFormMessage.text) {
      setGiftFormMessage({ type: "", text: "" });
    }
  };

  const handleGiftRegister = async (e) => {
    e.preventDefault();
    setGiftFormSubmitting(true);
    setGiftFormMessage({ type: "", text: "" });

    // if (!giftFormData.name.trim()) {
    //   setGiftFormMessage({ type: "error", text: "الرجاء إدخال الاسم" });
    //   setGiftFormSubmitting(false);
    //   return;
    // }

    if (!giftFormData.phone.match(/^(05|5)[0-9]{8}$/)) {
      setGiftFormMessage({
        type: "error",
        text: "رقم الجوال يجب أن يكون بصيغة: 05xxxxxxxx",
      });
      setGiftFormSubmitting(false);
      return;
    }

    try {
      const registrationData = {
        name: giftFormData.name.trim(),
        phone: giftFormData.phone.trim(),
        email: "",
        giftId: selectedGift?.id,
        giftName: selectedGift?.giftName,
        source: "gifts_page",
      };

      const result = await saveGiftRegistration(registrationData);
      console.log("🎁 Gift registration saved:", result.id);


     

     setGiftFormMessage({
  type: "success",
  text: "✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً لتسليم هديتك",
});


      setGiftFormData({ name: "", phone: "" });

      setTimeout(() => {
        closeGiftModal();
      }, 2500);
    } catch (error) {
      console.error("❌ Error:", error);
      setGiftFormMessage({
        type: "error",
        text: "حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى",
      });
    } finally {
      setGiftFormSubmitting(false);
    }
  };

  return (
    <div className="gifts-page">
      {/* Hero */}
      <section className="gifts-hero">
        <div className="container">
          <div className="hero-icon">
            <i className="fas fa-gift"></i>
          </div>
          <h1 className="hero-title">الهدايا المجانية</h1>
          <p className="hero-subtitle">
            اختر هديتك المفضلة واحصل عليها مجاناً من منصة وقت الذكاء
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="gifts-filters">
        <div className="container">
          <div className="filters-container">
            {/* Search */}
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="ابحث عن هدية..."
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
                <option value="name-asc">الاسم: أ - ي</option>
                <option value="name-desc">الاسم: ي - أ</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <i className="fas fa-gift"></i>
            <span>
              {loading
                ? "جاري التحميل..."
                : `${filteredGifts.length} هدية متاحة`}
            </span>
          </div>
        </div>
      </section>

      {/* Gifts Grid */}
      <section className="gifts-section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل الهدايا...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchGifts}>
                <i className="fas fa-redo"></i> إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !error && filteredGifts.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>لا توجد هدايا</h3>
              <p>لم نتمكن من العثور على هدايا تطابق بحثك</p>
            </div>
          )}

          {!loading && !error && filteredGifts.length > 0 && (
            <div className="gifts-grid">
              {filteredGifts.map((gift) => (
                <GiftCard key={gift.id} gift={gift} onRedeem={openGiftModal} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gifts-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">
              <i className="fas fa-gift"></i>
            </div>
            <h2>هل تريد المزيد من الهدايا؟</h2>
            <p>
              تابعنا على منصات التواصل الاجتماعي لتحصل على أحدث الهدايا والعروض
            </p>
            <div className="social-buttons">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn twitter"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn instagram"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn whatsapp"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Gift Registration */}
      {showGiftModal && selectedGift && (
        <div className="modal-overlay-premium" onClick={closeGiftModal}>
          <div
            className="modal-content-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeGiftModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header-premium">
              <div className="modal-icon-wrapper">
                <div className="modal-icon-bg"></div>
                <i className="fas fa-gift modal-icon"></i>
              </div>
              <h2 className="modal-title">احصل على هديتك الآن</h2>
              <p className="modal-subtitle">{selectedGift.giftName}</p>
              <div className="modal-divider"></div>
            </div>

            <form onSubmit={handleGiftRegister} className="modal-form-premium">
              <div className="form-group-premium">
  <label className="form-label-premium">
    <i className="fas fa-user"></i>
    الاسم (اختياري)
  </label>
  <div className="input-wrapper-premium">
    <input
      type="text"
      name="name"
      value={giftFormData.name}
      onChange={handleGiftInputChange}
      placeholder="أدخل اسمك"
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
                    value={giftFormData.phone}
                    onChange={handleGiftInputChange}
                    placeholder="05xxxxxxxx"
                    required
                    pattern="^(05|5)[0-9]{8}$"
                    className="form-input-premium"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              {giftFormMessage.text && (
                <div
                  className={`form-message-premium ${
                    giftFormMessage.type === "success"
                      ? "message-success"
                      : "message-error"
                  }`}
                >
                  <i
                    className={`fas ${
                      giftFormMessage.type === "success"
                        ? "fa-check-circle"
                        : "fa-exclamation-circle"
                    }`}
                  ></i>
                  <span>{giftFormMessage.text}</span>
                </div>
              )}

             <button
  type="submit"
  className="btn-submit-premium"
  disabled={giftFormSubmitting}
>
  <div className="btn-submit-shine"></div>
  {giftFormSubmitting ? (
    <>
      <div className="spinner-submit"></div>
      <span>جاري الإرسال...</span>
    </>
  ) : (
    <>
      <i className="fas fa-paper-plane"></i>
      <span>إرسال الهدية لك</span>
    </>
  )}
</button>

              <div className="form-note-premium">
  <i className="fas fa-lock"></i>
  <a href="/privacy-policy" target="_blank" style={{color: 'inherit', textDecoration: 'none'}}>
    سياسة الخصوصية
  </a>
</div>

<div className="form-note-premium" style={{marginTop: '10px', fontSize: '0.85rem'}}>
  <i className="fas fa-clock"></i>
  <span>إذا لم تصلك الهدية في خلال 24 ساعة تواصل معنا</span>
</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gifts;
