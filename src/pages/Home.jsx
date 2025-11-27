// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { scrollToSection } from "../utils/scroll";
import { useNavigate } from "react-router-dom";
import { submitGiftLead } from "../services/api"; // لو مش مستخدم ممكن تشيليه
import "../styles/products.css";
import {
  saveGiftRegistration,
  saveGeneralInquiry,
} from "../services/firebaseService";

import { Link } from "react-router-dom";

const AUDIENCE_FILTERS = {
  business: { label: "للشركات", code: "audience_3" },
  individuals: { label: "للأفراد", code: "audience_4" },
  associations: { label: "للجمعيات", code: "audience_5" },
  programmers: { label: "للمبرمجين", code: "audience_2" },
};

// ✅ Product Card Component - خارج Home (غير مستخدم حالياً في السكشن الرئيسي)
const ProductCard = ({ product, navigate, getProductIcon }) => {
  const isAvailable = product.readinessStatus === "متاح";

  const getReleaseDate = () => {
    if (isAvailable) return null;
    const date = new Date(product.createdAt);
    date.setMonth(date.getMonth() + 2);
    return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long" });
  };

  return (
    <div
      className="product-card-new"
      onClick={() => navigate(`/product/${product.id}`)}
    >
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
            {isAvailable ? "متاح الآن" : "قريباً"}{" "}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="product-content-white">
        <h3 className="product-title-new">{product.name}</h3>
        <p className="product-description-new">
          {product.targetAudiences || "منتج ذكاء اصطناعي متطور"}
        </p>

        {/* Action Button */}
        <button className="product-action-btn">
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

        <div className="info-circle">
          <i className="fas fa-info"></i>
        </div>
      </div>
    </div>
  );
};

// ✅ Gift Card Component - خارج Home
const GiftCard = ({ gift, navigate }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description =
    gift.description || gift.purpose || "هدية مميزة من منصة وقت الذكاء";
  const shortDescription = description.split("\n").slice(0, 3).join("\n");
  const hasMoreContent =
    description.split("\n").length > 3 || description.length > 150;

  return (
    <div className="gift-card-new" onClick={() => navigate("/gifts")}>
      {/* Header with Gradient */}
      <div className="gift-header-gradient">
        <div className="gift-icon-large">
          <i className="fas fa-gift"></i>
        </div>

        {/* Status Badge */}
        <div className="status-badge-top">
          <span className="status-badge status-gift">هدية مجانية</span>
        </div>
      </div>

      {/* Content */}
      <div className="gift-content-white">
        <h3 className="gift-title-new">{gift.giftName}</h3>

        {/* Description with Show More */}
        <p
          className="gift-description-new"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: showFullDescription ? "unset" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "3.4rem",
          }}
        >
          {showFullDescription ? description : shortDescription}
        </p>

        {/* Show More Button */}
        {hasMoreContent && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDescription(!showFullDescription);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#8B5CF6",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              padding: "0.5rem 0",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
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

        {/* Action Button */}
        <button
          className="gift-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/gifts");
          }}
        >
          احصل على هديتك الآن
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  // ✅ navigator لاستخدامه في زر "اكتشف المزيد" و غيره
  const navigate = useNavigate();

  const goToAudienceProducts = (code) => {
    navigate(`/products?audience=${encodeURIComponent(code)}`);
  };

  // ✅ ==== inquiry function ====
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inquiry: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const [homeProducts, setHomeProducts] = useState([]);
  const [homeProductsLoading, setHomeProductsLoading] = useState(true);
  const [homeProductsError, setHomeProductsError] = useState(null);

  // 🟢 جلب المنتجات من الـ API
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setHomeProductsLoading(true);
        setHomeProductsError(null);

        const response = await fetch(
          "https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts?limit=100"
        );

        if (!response.ok) {
          throw new Error("فشل تحميل المنتجات");
        }

        const data = await response.json();
        console.log("🏠 Home - Products API Response:", data);

        if (data.ok && Array.isArray(data.items)) {
          setHomeProducts(data.items);
        } else {
          setHomeProducts([]);
        }
      } catch (error) {
        console.error("❌ Home - Error fetching products:", error);
        setHomeProductsError("فشل تحميل المنتجات");
      } finally {
        setHomeProductsLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  // 🟢 أيقونة حسب الفئة
  const getHomeProductIcon = (subCategory) => {
    const icons = {
      "أسر منتجة": "fa-home",
      شركات: "fa-building",
      جمعيات: "fa-hands-helping",
      أفراد: "fa-user",
      default: "fa-robot",
    };
    return icons[subCategory] || icons.default;
  };

  // 🟢 نص البادج + اللون حسب حالة الجاهزية
  const getHomeBadge = (product) => {
    const isAvailable = product.readinessStatus === "متاح";
    const text = isAvailable ? "متاح الآن" : "قريباً";
    const colorVar = isAvailable
      ? "var(--success-color)"
      : "var(--danger-color)";

    return { text, colorVar, isAvailable };
  };

  // 🟢 وصف مختصر من الـ sellingPoints / features إن وُجِدت
  const getHomeProductDescription = (product) => {
    if (
      Array.isArray(product.sellingPoints) &&
      product.sellingPoints.length > 0
    ) {
      return product.sellingPoints[0];
    }
    if (Array.isArray(product.features) && product.features.length > 0) {
      return product.features[0];
    }
    return "حل ذكاء اصطناعي متكامل لتحويل أعمالك.";
  };

  // ✅ نص البادج حسب حالة الجاهزية
  const getBadgeText = (product) => {
    const isAvailable = product.readinessStatus === "متاح";
    if (isAvailable) return "متاح الآن";

    if (product.createdAt) {
      const date = new Date(product.createdAt);
      if (!isNaN(date.getTime())) {
        date.setMonth(date.getMonth() + 2);
        const label = date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
        });
        return `قريباً - ${label}`;
      }
    }

    return "قريباً";
  };

  // ✅ دالة فحص البيانات
  const validateForm = () => {
    const errors = {};

    // فحص الاسم
    // فحص الاسم
    if (!formData.name.trim()) {
      errors.name = "الرجاء إدخال الاسم";
    } else if (formData.name.trim().length < 3) {
      errors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    } else if (/\d/.test(formData.name)) {
      errors.name = "الاسم يجب أن لا يحتوي على أرقام";
    }
    // فحص رقم الهاتف
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    if (!formData.phone.trim()) {
      errors.phone = "الرجاء إدخال رقم الواتساب";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    }

    // فحص الاستفسار
    if (!formData.inquiry.trim()) {
      errors.inquiry = "الرجاء كتابة استفسارك";
    } else if (formData.inquiry.trim().length < 10) {
      errors.inquiry = "الاستفسار يجب أن يكون 10 أحرف على الأقل";
    }

    return errors;
  };

  // ==== functions converted from inline scripts in index.html ====
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // ✅ دالة إرسال الفورم
  const handleRegister = async (e) => {
    e.preventDefault();

    // مسح الأخطاء السابقة
    setFormErrors({});
    setSubmitStatus(null);

    // فحص البيانات
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // بدء الإرسال
    setIsSubmitting(true);

    try {
      // 🟢 حفظ البيانات في Firestore مباشرة
      await saveGeneralInquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        inquiry: formData.inquiry.trim(),
        // ممكن تضيفي حقول إضافية لو حابة (مثلاً: page: "home")
        page: "home",
      });

      // نجح الإرسال
      setSubmitStatus("success");

      // مسح الفورم
      setFormData({
        name: "",
        phone: "",
        inquiry: "",
      });

      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("خطأ في الإرسال:", error);
      setSubmitStatus("error");
      setFormErrors({
        submit:
          error.message ||
          "حدث خطأ أثناء إرسال الاستفسار. الرجاء المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterVideos = (tab) => {
    setActiveTab(tab);
  };

  // ==== effects for progress bar + loading + theme restore ====
  useEffect(() => {
    // restore theme
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);

    // loading
    const loading = document.getElementById("loading");
    if (loading) setTimeout(() => (loading.style.display = "none"), 300);

    // progress bar
    const bar = document.getElementById("progressBar");
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (bar) bar.style.width = scrolled + "%";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // helper to mark active tab class
  const tabCls = (key) => `tab-btn${activeTab === key ? " active" : ""}`;

  // ==== Animation: typing effect react ====

  // ✅ Refs for code blocks
  const codeBeforeRef = useRef(null);
  const codeAfterRef = useRef(null);

  // ✅ Typing animation function
  const typeText = (element, text, speed = 50) => {
    if (!element) return;

    // Clear and set up
    element.innerHTML = "";
    element.style.whiteSpace = "pre";
    element.style.fontFamily = "Consolas, 'Courier New', monospace";
    element.style.fontSize = "0.875rem";
    element.style.lineHeight = "1.5";

    // Add cursor at end
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "█"; // block cursor
    element.appendChild(cursor);

    let i = 0;

    const type = () => {
      if (i < text.length) {
        const char = text[i];
        if (char === "\n") {
          element.insertBefore(document.createElement("br"), cursor);
        } else {
          const charNode = document.createTextNode(char);
          element.insertBefore(charNode, cursor);
        }
        i++;
        setTimeout(type, speed);
      } else {
        cursor.style.opacity = "0";
        cursor.style.animation = "none";
      }
    };

    setTimeout(type, 200);
  };

  // ✅ Trigger typing after AOS animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const beforeText = `// Vibe Code Example
const ai = new VibeAI();

async function createApp() {
  const idea = await ai.understand(prompt);
  const code = await ai.generate(idea);
  return optimize(code);
}

Ship faster with AI ✨`;

            const afterText = `// سرعة فائقة
const app = await vibeCode.create({
  idea: "منصة تعليمية",
  features: ["دفع", "محتوى", "تقارير"],
  deadline: "3 أيام"
});

// جاهز للنشر! 🚀
await app.deploy();`;

            typeText(codeBeforeRef.current, beforeText, 80);
            typeText(codeAfterRef.current, afterText, 50);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const vibeSection = document.querySelector(".vibe-code");
    if (vibeSection) observer.observe(vibeSection);

    return () => {
      if (vibeSection) observer.unobserve(vibeSection);
    };
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div className="progress-bar" id="progressBar"></div>

      {/* Loading */}
      <div className="loading" id="loading">
        <div className="loading-spinner"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title" data-aos="fade-down">
              بوابتك الشاملة نحو عالم الذكاء الاصطناعي
            </h1>
            <p
              className="hero-subtitle"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              نجعل الذكاء الاصطناعي في متناول الجميع
            </p>
            <div
              className="hero-buttons"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Link to="/gifts" className="btn btn-secondary">
                <i className="fas fa-rocket"></i> احصل على هديتك الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="categories-bar">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title ">استكشف منتجاتنا وخدماتنا</h2>
          <p className="section-subtitle">
            حلول مبتكرة، مصممة لكل فئة باحترافية
          </p>
        </div>
        <div className="container">
          <div className="categories-container" data-aos="fade-up">
            {/* للشركات */}
            <div
              className="category-item"
              onClick={() =>
                goToAudienceProducts(AUDIENCE_FILTERS.business.code)
              }
            >
              <div className="category-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="category-title">للشركات</div>
              <div className="category-desc">حلول مؤسسية متكاملة</div>
            </div>

            {/* للأفراد */}
            <div
              className="category-item"
              onClick={() =>
                goToAudienceProducts(AUDIENCE_FILTERS.individuals.code)
              }
            >
              <div className="category-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="category-title">للأفراد</div>
              <div className="category-desc">طور مهاراتك في الذكاء</div>
            </div>

            {/* للجمعيات */}
            <div
              className="category-item"
              onClick={() =>
                goToAudienceProducts(AUDIENCE_FILTERS.associations.code)
              }
            >
              <div className="category-icon">
                <i className="fas fa-gift"></i>
              </div>
              <div className="category-title">للجمعيات</div>
              <div className="category-desc">اختر الأنسب لمؤسستك</div>
            </div>

            {/* للمبرمجين */}
            <div
              className="category-item"
              onClick={() =>
                goToAudienceProducts(AUDIENCE_FILTERS.programmers.code)
              }
            >
              <div className="category-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="category-title">للمبرمجين</div>
              <div className="category-desc">تعلم بأسلوب مبتكر</div>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title ">منتجات مختارة بعناية</h2>
          <p className="section-subtitle">ابدأ استكشافك الآن!</p>
        </div>
        <div className="container">
          <div className="products-grid">
            {/* حالة التحميل */}
            {homeProductsLoading && (
              <div
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "2rem 0",
                }}
              >
                <div className="spinner" style={{ marginBottom: "1rem" }}></div>
                <p>جاري تحميل المنتجات...</p>
              </div>
            )}

            {/* حالة الخطأ */}
            {homeProductsError && !homeProductsLoading && (
              <div
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "2rem 0",
                  color: "var(--danger-color)",
                }}
              >
                <i
                  className="fas fa-exclamation-circle"
                  style={{ marginLeft: 8 }}
                ></i>
                <p>{homeProductsError}</p>
              </div>
            )}

            {/* المنتجات */}
            {!homeProductsLoading &&
              !homeProductsError &&
              homeProducts.length > 0 &&
              homeProducts.slice(0, 8).map((product, index) => {
                const {
                  text: badgeText,
                  colorVar,
                  isAvailable,
                } = getHomeBadge(product);

                const delay = (index + 1) * 100;

                return (
                  <div
                    key={product.id}
                    className="product-card"
                    data-aos="fade-up"
                    data-aos-delay={delay}
                    style={{
                      ...(isAvailable ? {} : { opacity: 0.9 }),
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div
                      className="product-badge"
                      style={{ background: colorVar }}
                    >
                      {badgeText}
                    </div>

                    <div
                      className="product-image"
                      style={!isAvailable ? { opacity: 0.7 } : {}}
                    >
                      <i
                        className={`fas ${getHomeProductIcon(
                          product.subCategory
                        )}`}
                      ></i>
                    </div>

                    <div
                      className="product-content"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-desc">
                        {getHomeProductDescription(product)}
                      </p>

                      <button
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          marginTop: "auto", // 👈 يخلي الزر ثابت تحت
                          ...(isAvailable ? {} : { opacity: 0.7 }),
                        }}
                        onClick={() => navigate(`/products/${product.id}`)}
                        disabled={!isAvailable}
                      >
                        <i
                          className={
                            isAvailable ? "fas fa-arrow-left" : "fas fa-clock"
                          }
                        ></i>{" "}
                        {isAvailable ? "اكتشف المزيد" : "قريباً"}
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* لا توجد منتجات */}
            {!homeProductsLoading &&
              !homeProductsError &&
              homeProducts.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                    padding: "2rem 0",
                  }}
                >
                  <i
                    className="fas fa-inbox"
                    style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
                  ></i>
                  <p>لا توجد منتجات متاحة حالياً.</p>
                </div>
              )}
          </div>

          {/* View All Products Button */}
          <div
            style={{ textAlign: "center", marginTop: "3rem" }}
            data-aos="fade-up"
          >
            <Link
              to="/products"
              className="btn btn-primary"
              style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}
            >
              <i className="fas fa-th"></i> عرض جميع المنتجات والخدمات
            </Link>
          </div>
        </div>
      </section>

      {/* AI Programming Section - NEW DESIGN */}
      <section className="ai-programming-section" id="vibe-code">
        {/* Decorative Background Elements */}
        <div className="ai-bg-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="container">
          {/* Section Header */}
          <div className="ai-section-header" data-aos="fade-up">
            <span className="section-eyebrow">
              <i className="fas fa-microchip"></i>
              تقنية Vibe Coding
            </span>
            <h2 className="ai-main-title">برمجة بالذكاء الاصطناعي</h2>
            <p className="ai-main-subtitle">
              نحوّل أفكارك إلى تطبيقات حقيقية في وقت قياسي باستخدام أحدث تقنيات
              الذكاء الاصطناعي
            </p>
          </div>

          {/* Main Bento Grid */}
          <div className="ai-bento-grid">
            {/* Hero Card - Large */}
            <div
              className="bento-card bento-hero"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="hero-card-content">
                <div className="hero-icon-wrapper">
                  <div className="icon-glow"></div>
                  <div className="hero-icon">
                    <i className="fas fa-wand-magic-sparkles"></i>
                  </div>
                </div>
                <h3>من الفكرة للتطبيق</h3>
                <p>
                  فقط أخبرنا بفكرتك، والذكاء الاصطناعي يتولى الباقي. لا تحتاج
                  خبرة تقنية أو فريق مبرمجين.
                </p>
                <div className="hero-tags">
                  <span className="tag">
                    <i className="fas fa-check"></i> بدون كود
                  </span>
                  <span className="tag">
                    <i className="fas fa-check"></i> سريع
                  </span>
                  <span className="tag">
                    <i className="fas fa-check"></i> احترافي
                  </span>
                </div>
              </div>
              <div className="hero-visual">
                <div className="code-mockup">
                  <div className="mockup-header">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="mockup-lines">
                    <div className="line line-1"></div>
                    <div className="line line-2"></div>
                    <div className="line line-3"></div>
                    <div className="line line-4"></div>
                    <div className="line line-5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card 1 - Time */}
            <div
              className="bento-card bento-stat stat-time"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="stat-icon-ring">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="stat-content">
                <span className="stat-number">3-5</span>
                <span className="stat-unit">أيام</span>
                <span className="stat-desc">بدلاً من شهور</span>
              </div>
              <div className="stat-decoration"></div>
            </div>

            {/* Stats Card 2 - Savings */}
            <div
              className="bento-card bento-stat stat-savings"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="stat-icon-ring">
                <i className="fas fa-piggy-bank"></i>
              </div>
              <div className="stat-content">
                <span className="stat-number">80%</span>
                <span className="stat-unit">توفير</span>
                <span className="stat-desc">من التكلفة</span>
              </div>
              <div className="stat-decoration"></div>
            </div>

            {/* Process Steps Card */}
            <div
              className="bento-card bento-process"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h4 className="process-title">
                <i className="fas fa-route"></i>
                كيف نعمل؟
              </h4>
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-num">1</div>
                  <div className="step-info">
                    <strong>اشرح فكرتك</strong>
                    <span>بكلماتك البسيطة</span>
                  </div>
                </div>
                <div className="step-connector">
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="process-step">
                  <div className="step-num">2</div>
                  <div className="step-info">
                    <strong>نبرمج لك</strong>
                    <span>بالذكاء الاصطناعي</span>
                  </div>
                </div>
                <div className="step-connector">
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="process-step">
                  <div className="step-num">3</div>
                  <div className="step-info">
                    <strong>استلم مشروعك</strong>
                    <span>جاهز للإطلاق</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div
              className="bento-card bento-features"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <h4 className="features-title">
                <i className="fas fa-sparkles"></i>
                لماذا نحن؟
              </h4>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <span>AI يكتب الكود</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-shield-check"></i>
                  </div>
                  <span>جودة مضمونة</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <span>دعم متواصل</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-arrows-rotate"></i>
                  </div>
                  <span>تعديلات مجانية</span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div
              className="bento-card bento-cta"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="cta-content">
                <div className="cta-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="cta-text">
                  <h4>جاهز تبدأ؟</h4>
                  <p>استشارة مجانية لمشروعك</p>
                </div>
              </div>
              <a href="/VibeCode" className="cta-btn">
                <span>ابدأ الآن</span>
                <i className="fas fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="videos-section" id="videos">
        <div className="container py-5">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">مكتبة الفيديوهات التعليمية</h2>
            <p className="section-subtitle">
              تعلم استخدام الذكاء الاصطناعي خطوة بخطوة
            </p>
          </div>

          <div className="videos-tabs" data-aos="fade-up" data-aos-delay="100">
            <button
              className={tabCls("all")}
              onClick={() => filterVideos("all")}
            >
              الكل
            </button>
            <button
              className={tabCls("beginner")}
              onClick={() => filterVideos("beginner")}
            >
              مبتدئ
            </button>
            <button
              className={tabCls("intermediate")}
              onClick={() => filterVideos("intermediate")}
            >
              متوسط
            </button>
            <button
              className={tabCls("advanced")}
              onClick={() => filterVideos("advanced")}
            >
              متقدم
            </button>
          </div>

          <div className="videos-grid" data-aos="fade-up" data-aos-delay="200">
            <div className="video-card" data-level="beginner">
              <div className="video-thumbnail">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">
                  مقدمة في الذكاء الاصطناعي للأعمال
                </h3>
                <div className="video-meta">
                  <span>
                    <i className="fas fa-clock"></i> 12:45
                  </span>
                  <span>
                    <i className="fas fa-eye"></i> 1.2K
                  </span>
                  <span>
                    <i className="fas fa-heart"></i> 234
                  </span>
                </div>
              </div>
            </div>

            <div className="video-card" data-level="intermediate">
              <div className="video-thumbnail">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">كيف تستخدم ChatGPT في التسويق</h3>
                <div className="video-meta">
                  <span>
                    <i className="fas fa-clock"></i> 15:30
                  </span>
                  <span>
                    <i className="fas fa-eye"></i> 2.5K
                  </span>
                  <span>
                    <i className="fas fa-heart"></i> 456
                  </span>
                </div>
              </div>
            </div>

            <div className="video-card" data-level="advanced">
              <div className="video-thumbnail">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">
                  البرمجة بالفايب كود - الدرس الأول
                </h3>
                <div className="video-meta">
                  <span>
                    <i className="fas fa-clock"></i> 20:15
                  </span>
                  <span>
                    <i className="fas fa-eye"></i> 3.8K
                  </span>
                  <span>
                    <i className="fas fa-heart"></i> 789
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section" id="news">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">أخبار الذكاء</h2>
            <p className="section-subtitle">
              آخر التطورات والمستجدات في عالم الذكاء الاصطناعي
            </p>
          </div>

          <div className="news-container">
            {/* Featured News */}
            <div
              className="featured-news"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="featured-article">
                <div className="featured-image">
                  <i className="fas fa-robot"></i>
                  <span className="featured-badge">حصري</span>
                </div>
                <div className="featured-content">
                  <h3 className="featured-title">
                    OpenAI تطلق GPT-5 بقدرات غير مسبوقة
                  </h3>
                  <p className="featured-excerpt">
                    في تطور مذهل، أعلنت شركة OpenAI عن إطلاق الجيل الخامس من
                    نموذج GPT بقدرات تفوق كل التوقعات، حيث يمكنه الآن فهم السياق
                    بشكل أعمق والقيام بمهام معقدة كانت تعتبر مستحيلة سابقاً...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">م</div>
                      <span>محمد أحمد</span>
                    </div>
                    <span>منذ ساعتين</span>
                  </div>
                </div>
              </div>

              <div className="side-news">
                <div className="side-article">
                  <div className="side-article-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="side-article-content">
                    <h4 className="side-article-title">
                      السعودية تستثمر 100 مليار في الذكاء الاصطناعي
                    </h4>
                    <div className="side-article-meta">منذ 5 ساعات</div>
                  </div>
                </div>

                <div className="side-article">
                  <div className="side-article-icon">
                    <i className="fas fa-brain"></i>
                  </div>
                  <div className="side-article-content">
                    <h4 className="side-article-title">
                      Claude 3.5 يتفوق في الاختبارات البرمجية
                    </h4>
                    <div className="side-article-meta">منذ يوم</div>
                  </div>
                </div>

                <div className="side-article">
                  <div className="side-article-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="side-article-content">
                    <h4 className="side-article-title">
                      دورات مجانية في الذكاء الاصطناعي من Google
                    </h4>
                    <div className="side-article-meta">منذ يومين</div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="news-grid">
              <article
                className="news-card"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="news-image">
                  <i className="fas fa-microchip"></i>
                </div>
                <div className="news-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> تقنية
                  </span>
                  <h3 className="news-title">
                    شركة Apple تكشف عن معالج AI جديد
                  </h3>
                  <p className="news-excerpt">
                    معالج جديد مخصص للذكاء الاصطناعي يوفر قوة معالجة تفوق
                    المنافسين...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">س</div>
                      <span>سارة علي</span>
                    </div>
                    <span>منذ 3 أيام</span>
                  </div>
                </div>
              </article>

              <article
                className="news-card"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="news-image">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div className="news-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> نصائح
                  </span>
                  <h3 className="news-title">
                    10 تقنيات متقدمة في كتابة البرومبت
                  </h3>
                  <p className="news-excerpt">
                    اكتشف الأساليب الاحترافية للحصول على أفضل النتائج من نماذج
                    الذكاء...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">ع</div>
                      <span>عبدالله محمد</span>
                    </div>
                    <span>منذ 4 أيام</span>
                  </div>
                </div>
              </article>

              <article
                className="news-card"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="news-image">
                  <i className="fas fa-users"></i>
                </div>
                <div className="news-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> مجتمع
                  </span>
                  <h3 className="news-title">
                    مؤتمر الذكاء الاصطناعي العربي 2025
                  </h3>
                  <p className="news-excerpt">
                    أكبر تجمع للخبراء والمهتمين بالذكاء الاصطناعي في المنطقة
                    العربية...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">ف</div>
                      <span>فاطمة أحمد</span>
                    </div>
                    <span>منذ أسبوع</span>
                  </div>
                </div>
              </article>

              <article
                className="news-card"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="news-image">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="news-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> أمان
                  </span>
                  <h3 className="news-title">
                    قوانين جديدة لتنظيم الذكاء الاصطناعي
                  </h3>
                  <p className="news-excerpt">
                    الاتحاد الأوروبي يضع معايير صارمة لاستخدام تقنيات الذكاء
                    الاصطناعي...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">ح</div>
                      <span>حسام الدين</span>
                    </div>
                    <span>منذ أسبوع</span>
                  </div>
                </div>
              </article>

              <article
                className="news-card"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="news-image">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="news-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> شركات ناشئة
                  </span>
                  <h3 className="news-title">
                    شركة سعودية تجمع 50 مليون دولار
                  </h3>
                  <p className="news-excerpt">
                    استثمار ضخم في شركة ناشئة سعودية متخصصة في حلول الذكاء
                    الاصطناعي...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">ر</div>
                      <span>رانيا صالح</span>
                    </div>
                    <span>منذ أسبوعين</span>
                  </div>
                </div>
              </article>

              <article
                className="news-card"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                <div className="news-image">
                  <i className="fas fa-hospital"></i>
                </div>
                <div className="news-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> صحة
                  </span>
                  <h3 className="news-title">
                    الذكاء الاصطناعي يكتشف علاجاً جديداً
                  </h3>
                  <p className="news-excerpt">
                    نجاح مذهل للذكاء الاصطناعي في اكتشاف علاج لمرض نادر في وقت
                    قياسي...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">د</div>
                      <span>د. أحمد سالم</span>
                    </div>
                    <span>منذ 3 أسابيع</span>
                  </div>
                </div>
              </article>
            </div>

            {/* View More Button */}
            <div className="news-more" data-aos="fade-up" data-aos-delay="800">
              <Link to="/news" className="btn-view-more">
                <span>اكتشف المزيد من الأخبار</span>
                <i className="fas fa-arrow-left"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Section */}
      <section className="inquiry-section" id="inquiry">
        <div className="container">
          <div className="inquiry-container">
            <div
              className="register-form"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="inquiry-title">أرسل استفسارك</h3>
              <p className="inquiry-subtitle">
                نحن هنا للإجابة على جميع استفساراتك
              </p>

              {/* رسالة النجاح */}
              {submitStatus === "success" && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i>
                  <span>تم إرسال استفسارك بنجاح! سنتواصل معك قريباً.</span>
                </div>
              )}

              {/* رسالة الخطأ */}
              {submitStatus === "error" && formErrors.submit && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{formErrors.submit}</span>
                </div>
              )}

              <form onSubmit={handleRegister}>
                {/* حقل الاسم */}
                <div className="inquiry-form-group">
                  <label className="inquiry-label">
                    الاسم الكامل <span className="required-mark">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="أدخل اسمك الكامل"
                    className={`inquiry-input ${
                      formErrors.name ? "error" : ""
                    }`}
                  />
                  {formErrors.name && (
                    <span className="error-message">
                      <i className="fas fa-exclamation-circle"></i>{" "}
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* حقل رقم الواتساب */}
                <div className="inquiry-form-group">
                  <label className="inquiry-label">
                    رقم الواتساب <span className="required-mark">*</span>
                  </label>
                  <div className="phone-input-wrapper">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="05xxxxxxxx"
                      maxLength="10"
                      className={`inquiry-input phone-input ${
                        formErrors.phone ? "error" : ""
                      }`}
                    />
                    <i className="fab fa-whatsapp whatsapp-icon"></i>
                  </div>
                  {formErrors.phone && (
                    <span className="error-message">
                      <i className="fas fa-exclamation-circle"></i>{" "}
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                {/* حقل الاستفسار */}
                <div className="inquiry-form-group">
                  <label className="inquiry-label">
                    استفسارك <span className="required-mark">*</span>
                  </label>
                  <textarea
                    value={formData.inquiry}
                    onChange={(e) =>
                      setFormData({ ...formData, inquiry: e.target.value })
                    }
                    placeholder="اكتب استفسارك هنا..."
                    rows="5"
                    className={`inquiry-textarea ${
                      formErrors.inquiry ? "error" : ""
                    }`}
                  ></textarea>
                  {formErrors.inquiry && (
                    <span className="error-message">
                      <i className="fas fa-exclamation-circle"></i>{" "}
                      {formErrors.inquiry}
                    </span>
                  )}
                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  className={`btn btn-primary inquiry-submit-btn ${
                    isSubmitting ? "submitting" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> إرسال الاستفسار
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
