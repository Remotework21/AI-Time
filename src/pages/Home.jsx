// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  // ==== functions converted from inline scripts in index.html ====
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("تم استلام بياناتك ✨");
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
              <a href="#gifts" className="btn btn-primary">
                <i className="fas fa-gift"></i> ابدأ الآن
              </a>
              <a href="#products" className="btn btn-secondary">
                <i className="fas fa-rocket"></i> تعرف على المزيد
              </a>
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
              <div className="category-title">ابدأ الآن</div>
              <div className="category-desc">احصل على هديتك</div>
            </div>

            <div
              className="category-item"
              onClick={() => scrollToSection("students")}
            >
              <div className="category-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="category-title">للطلاب</div>
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
                <div className="code-block" ref={codeBeforeRef}></div>{" "}
                {/* 👈 ref added */}
              </div>

              <div className="code-after">
                <div className="code-label">
                  <i className="fas fa-check-circle"></i>
                  بعد: الفايب كود
                </div>
                <div className="code-block" ref={codeAfterRef}></div>{" "}
                {/* 👈 ref added */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Gifts Section */}
      <section className="gifts-section" id="gifts">
        <div className="container">
          <div className="gifts-container">
            <div className="section-header" data-aos="fade-up">
              <h2 className="section-title">ابدأ رحلتك مع الذكاء مجاناً</h2>
              <p className="section-subtitle">
                احصل على هدايا قيمة لتبدأ رحلتك في عالم الذكاء الاصطناعي
              </p>
            </div>

            <div className="gifts-grid" data-aos="fade-up" data-aos-delay="200">
              <a
                href="gift-details.html?id=guide"
                className="gift-item"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="gift-icon">📚</div>
                <h3 className="gift-title">دليل الذكاء للأعمال</h3>
                <p className="gift-desc">
                  10 طرق مبتكرة لاستخدام ChatGPT في عملك
                </p>
              </a>

              <a
                href="gift-details.html?id=template"
                className="gift-item"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="gift-icon">🎯</div>
                <h3 className="gift-title">قالب بطاقات الإتقان</h3>
                <p className="gift-desc">نظام جاهز لتنظيم معرفتك</p>
              </a>

              <a
                href="gift-details.html?id=consultation"
                className="gift-item"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="gift-icon">💬</div>
                <h3 className="gift-title">استشارة مجانية</h3>
                <p className="gift-desc">15 دقيقة مع خبير بعد: الفايب كود</p>
              </a>
            </div>

            <div
              className="register-form"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>
                سجل الآن واحصل على هداياك
              </h3>
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>الاسم الكامل</label>
                    <input type="text" required placeholder="أدخل اسمك" />
                  </div>
                  <div className="form-group">
                    <label>البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>رقم الواتساب</label>
                    <input type="tel" required placeholder="05xxxxxxxx" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    background: "white",
                    color: "var(--primary-color)",
                  }}
                >
                  <i className="fas fa-gift"></i> احصل على هداياك الآن
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

      {/* Floating WhatsApp Button */}
      <a
        className="whatsapp-float"
        href="https://wa.me/"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Info Button */}
      <button
        type="button"
        className="info-button"
        onClick={() =>
          document.querySelector(".info-panel")?.classList.add("active")
        }
        aria-label="info panel"
      >
        <i className="fas fa-info"></i>
      </button>

      {/* Info Panel */}
      <aside className="info-panel">
        <span
          className="close-info"
          onClick={() =>
            document.querySelector(".info-panel")?.classList.remove("active")
          }
          aria-label="close info"
        >
          <i className="fas fa-times"></i>
        </span>

        <h3>معلومات المنصة</h3>

        <h4>عن وقت الذكاء</h4>
        <p>
          منصة رائدة في تقديم حلول الذكاء الاصطناعي للشركات والأفراد في العالم
          العربي.
        </p>

        <h4>ماذا نقدم؟</h4>
        <ul>
          <li>منتجات ذكاء اصطناعي جاهزة</li>
          <li>حلول أتمتة ذكية (Vibe Code)</li>
          <li>دورات ومواد تعليمية</li>
          <li>أخبار وتحديثات مستمرة</li>
        </ul>
      </aside>

      {/* Theme toggle button كان داخل الهيدر الأصلي؛ 
          لو حبيتي نفس الزر هنا، تقدري تضيفيه أو تسيبيه داخل Header.jsx */}
    </>
  );
}
