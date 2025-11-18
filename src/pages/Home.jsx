// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { scrollToSection } from "../utils/scroll";
import { useNavigate } from "react-router-dom";
import { submitGiftLead, submitGeneralInquiry } from "../services/api";
import "../styles/products.css";
import { saveGiftRegistration } from "../services/firebaseService";
import { Link } from "react-router-dom";


// ✅ Product Card Component - خارج Home
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

  // ✅ ==== inquiry function ====
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inquiry: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // ✅ دالة فحص البيانات
  const validateForm = () => {
    const errors = {};

    // فحص الاسم
    if (!formData.name.trim()) {
      errors.name = "الرجاء إدخال الاسم";
    } else if (formData.name.trim().length < 3) {
      errors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
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
      // إرسال البيانات للداتابيز
      await submitGeneralInquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        notes: formData.inquiry.trim(),
        ref: "", // يمكن إضافة referral code لو موجود
        sessionId: "", // يمكن إضافة session ID
        utm: {}, // يمكن إضافة tracking data
        eventId: "",
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

  // ==== existing functions (toggleTheme, scrollToSection, etc.) ====

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
    cursor.textContent = "█"; // block cursor (or "|" for pipe)
    element.appendChild(cursor);

    let i = 0;

    const type = () => {
      if (i < text.length) {
        const char = text[i];
        if (char === "\n") {
          // Insert line break
          element.insertBefore(document.createElement("br"), cursor);
        } else {
          // Insert character
          const charNode = document.createTextNode(char);
          element.insertBefore(charNode, cursor);
        }
        i++;
        setTimeout(type, speed);
      } else {
        // Done: hide cursor
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
      { threshold: 0.2 } // trigger when 20% visible
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

      {/* Header (موجودة عندك كـ Component منفصل) 
          كان في index.html هنا، لكن في المشروع الحالي معمولة في Header.jsx
          أسيبه للـ App يحقنه فوق. */}

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div
            className="hero-content text-center d-flex flex-column justify-content-center"
            style={{ minHeight: "calc(50vh - 40px)" }}
          >
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
        <div className="container">
          <div className="categories-container" data-aos="fade-up">
            <div
              className="category-item"
              onClick={() => scrollToSection("business")}
            >
              <div className="category-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="category-title">للشركات</div>
              <div className="category-desc">حلول مؤسسية متكاملة</div>
            </div>

            <div
              className="category-item"
              onClick={() => scrollToSection("individuals")}
            >
              <div className="category-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="category-title">للأفراد</div>
              <div className="category-desc">طور مهاراتك في الذكاء</div>
            </div>

            <div
              className="category-item"
              onClick={() => scrollToSection("free-gifts")}
            >
              <div className="category-icon">
                <i className="fas fa-gift"></i>
              </div>
              <div className="category-title">للجمعيات</div>
              <div className="category-desc">اختر الانسب لمؤسستك</div>
            </div>

            <div
              className="category-item"
              onClick={() => scrollToSection("students")}
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

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">منتجاتنا وخدماتنا</h2>
            <p className="section-subtitle">حلول ذكية متكاملة لتحويل أعمالك</p>
          </div>

          <div className="products-grid">
            {/* Product 1 */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div
                className="product-badge"
                style={{ background: "var(--success-color)" }}
              >
                متاح الآن
              </div>
              <div className="product-image">
                <i className="fas fa-home"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">ذكاء الأسر المنتجة</h3>
                <p className="product-desc">
                  حول مشروعك المنزلي إلى قوة اقتصادية بالذكاء الاصطناعي
                </p>
                <a
                  href="product-details.html?id=1"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  <i className="fas fa-arrow-left"></i> اكتشف المزيد
                </a>
              </div>
            </div>

            {/* Product 2 */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div
                className="product-badge"
                style={{ background: "var(--success-color)" }}
              >
                متاح الآن
              </div>
              <div className="product-image">
                <i className="fas fa-building"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">الذكاء المؤسسي</h3>
                <p className="product-desc">
                  نظام متكامل يحول معرفة مؤسستك إلى مستشار ذكي متاح 24/7
                </p>
                <a
                  href="product-details.html?id=2"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  <i className="fas fa-arrow-left"></i> اكتشف المزيد
                </a>
              </div>
            </div>

            {/* Product 3 */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div
                className="product-badge"
                style={{ background: "var(--success-color)" }}
              >
                متاح الآن
              </div>
              <div className="product-image">
                <i className="fas fa-brain"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">بطاقات الإتقان الذكية</h3>
                <p className="product-desc">
                  نظام ثوري لإدارة المعرفة وتطوير المهارات بالذكاء الاصطناعي
                </p>
                <a
                  href="product-details.html?id=3"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  <i className="fas fa-arrow-left"></i> اكتشف المزيد
                </a>
              </div>
            </div>

            {/* Product 4 */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div
                className="product-badge"
                style={{ background: "var(--success-color)" }}
              >
                متاح الآن
              </div>
              <div className="product-image">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">منصة صفحات الهبوط</h3>
                <p className="product-desc">
                  أنشئ صفحات هبوط احترافية بالذكاء الاصطناعي في دقائق
                </p>
                <a
                  href="product-details.html?id=4"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  <i className="fas fa-arrow-left"></i> اكتشف المزيد
                </a>
              </div>
            </div>

            {/* Product 5 */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div
                className="product-badge"
                style={{ background: "var(--success-color)" }}
              >
                متاح الآن
              </div>
              <div className="product-image">
                <i className="fas fa-cogs"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">الأتمتة الذكية (Vibe Code)</h3>
                <p className="product-desc">
                  برمجة حلول مخصصة بالذكاء الاصطناعي في وقت قياسي
                </p>
                <a
                  href="request-program.html"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  <i className="fas fa-code"></i> اطلب برنامجك
                </a>
              </div>
            </div>

            {/* Product 6 */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div
                className="product-badge"
                style={{ background: "var(--success-color)" }}
              >
                متاح الآن
              </div>
              <div className="product-image">
                <i className="fas fa-robot"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">الذكاءات المخصصة</h3>
                <p className="product-desc">
                  بعد: الفايب كود مخصص لمجالك واحتياجاتك الخاصة
                </p>
                <a
                  href="product-details.html?id=6"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  <i className="fas fa-arrow-left"></i> اكتشف المزيد
                </a>
              </div>
            </div>

            {/* Product 7 - Coming Soon */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="700"
              style={{ opacity: 0.9 }}
            >
              <div
                className="product-badge"
                style={{ background: "var(--danger-color)" }}
              >
                قريباً - فبراير 2025
              </div>
              <div className="product-image" style={{ opacity: 0.7 }}>
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">برنامج وظيفة ذكية</h3>
                <p className="product-desc">
                  برنامج تدريبي متكامل للعمل كمساعد ذكي باستخدام الذكاء
                  الاصطناعي
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem", opacity: 0.7 }}
                  disabled
                >
                  <i className="fas fa-clock"></i> قريباً
                </button>
              </div>
            </div>

            {/* Product 8 - Coming Soon */}
            <div
              className="product-card"
              data-aos="fade-up"
              data-aos-delay="800"
              style={{ opacity: 0.9 }}
            >
              <div
                className="product-badge"
                style={{ background: "var(--danger-color)" }}
              >
                قريباً - أبريل 2025
              </div>
              <div className="product-image" style={{ opacity: 0.7 }}>
                <i className="fas fa-exchange-alt"></i>
              </div>
              <div className="product-content">
                <h3 className="product-title">منصة تبادل الخبرات</h3>
                <p className="product-desc">
                  منصة لتبادل الخبرات البرمجية والتقنية بين المتخصصين
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.5rem", opacity: 0.7 }}
                  disabled
                >
                  <i className="fas fa-clock"></i> قريباً
                </button>
              </div>
            </div>
          </div>

          {/* View All Products Button */}
          <div
            style={{ textAlign: "center", marginTop: "3rem" }}
            data-aos="fade-up"
          >
            <a
              href="products.html"
              className="btn btn-primary"
              style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}
            >
              <i className="fas fa-th"></i> عرض جميع المنتجات والخدمات
            </a>
          </div>
        </div>
      </section>

      {/* Vibe Code Section */}
      <section className="vibe-code" id="vibe-code">
        <div className="container">
          <div className="vibe-content" data-aos="fade-up">
            <div className="vibe-text">
              <h2>برمجة بالذكاء الاصطناعي</h2>
              <p>
                نحن نؤتمتها لك في أسرع وقت! حول العمليات المعقدة والمتكررة إلى
                أنظمة ذكية تعمل تلقائياً. مع تقنية الفايب كود، نبرمج حلولك
                بالذكاء الاصطناعي في وقت قياسي.
              </p>

              <div className="vibe-features">
                <div className="vibe-feature">
                  <i className="fas fa-bolt"></i>
                  <span>سرعة فائقة</span>
                </div>
                <div className="vibe-feature">
                  <i className="fas fa-code"></i>
                  <span>قبل: الطريقة التقليدية</span>
                </div>
                <div className="vibe-feature">
                  <i className="fas fa-brain"></i>
                  <span>بعد: الفايب كود</span>
                </div>
                <div className="vibe-feature">
                  <i className="fas fa-users"></i>
                  <span>عمل تعاوني</span>
                </div>
              </div>

              <a href="request-program.html" className="btn btn-primary">
                <i className="fas fa-rocket"></i> جرب الآن مجاناً
              </a>
            </div>

            <div className="code-comparison">
              <div className="code-before">
                <div className="code-label">
                  <i className="fas fa-times-circle"></i>
                  قبل: الطريقة التقليدية
                </div>
                <div className="code-block" ref={codeBeforeRef}></div>
                {/* 👈 ref added */}
              </div>

              <div className="code-after">
                <div className="code-label">
                  <i className="fas fa-check-circle"></i>
                  بعد: الفايب كود
                </div>
                <div className="code-block" ref={codeAfterRef}></div>
                {/* 👈 ref added */}
              </div>
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

      {/* Videos Section */}
      <section className="videos-section" id="videos">
        <div className="container">
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
              <a href="news.html" className="btn-view-more">
                <span>اكتشف المزيد من الأخبار</span>
                <i className="fas fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer موجود كـ Component منفصل في مشروعك */}

      {/* Theme toggle button كان داخل الهيدر الأصلي؛ 
          لو حبيتي نفس الزر هنا، تقدري تضيفيه أو تسيبيه داخل Header.jsx */}
    </>
  );
}
