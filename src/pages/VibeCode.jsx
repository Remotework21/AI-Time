// src/pages/VibeCode.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/vibecode.css";

export default function VibeCode() {
  const codeBeforeRef = useRef(null);
  const codeAfterRef = useRef(null);

  // ✅ Typing animation helper (reused from Home)
  const typeText = (element, text, speed = 50) => {
    // 🔒 Guard: element must exist AND be in DOM
    if (!element || !document.body.contains(element)) {
    console.warn("typeText: target element not in DOM");
    return;
    }
  
    // Clear content first
  element.innerHTML = "";

  // Ensure cursor exists and is attached
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.textContent = "█";
  cursor.style.display = "inline-block";
  cursor.style.width = "2px";
  cursor.style.height = "1em";
  cursor.style.backgroundColor = "currentColor";
  cursor.style.verticalAlign = "baseline";
  cursor.style.animation = "blink 1s step-end infinite";
  element.appendChild(cursor);

  let i = 0;

  const type = () => {
    // 🛡️ SAFETY CHECK: is cursor still in the DOM?
    if (!element.contains(cursor)) {
      console.warn("Cursor detached during typing — aborting.");
      return;
    }

    if (i < text.length) {
      const char = text[i];
      const newChild = char === "\n"
        ? document.createElement("br")
        : document.createTextNode(char);

      try {
        element.insertBefore(newChild, cursor);
      } catch (err) {
        console.error("Insert failed — cursor may be detached:", err);
        return;
      }

      i++;
      setTimeout(type, speed);
    } else {
      // Typing done → hide cursor
      cursor.style.opacity = "0";
      cursor.style.animation = "none";
    }
  };

    setTimeout(type, 200);
  };

  // ✅ Trigger typing after section scrolls into view
  useEffect(() => {
    let hasRun = false;
  
    const runTyping = () => {
      if (hasRun) return;
      hasRun = true;
  
      const beforeText = `// الطريقة التقليدية
  1. جمع المتطلبات (~أسبوع)
  2. التصميم والرسم (~أسبوع)
  3. التعاقد مع مبرمج (~2–4 أسابيع)
  4. التطوير والاختبار (~4–8 أسابيع)
  5. التعديلات المتكررة…
  → الإجمالي: 2–4 شهور`;
  
      const afterText = `// الفايب كود
  const project = await vibeCode.deploy({
    idea: "منصة تعليمية",
    deadline: "٣٠ يوم",
    budget: "معقول"
  });
  // ✅ جاهز للنشر!
  project.launch();`;
  
      typeText(codeBeforeRef.current, beforeText, 80);
      typeText(codeAfterRef.current, afterText, 50);
    };
  
    // ✅ Wait for AOS animation to finish → then type
    const checkAOS = () => {
      const section = document.querySelector(".vibe-code"); // or .vibe-hero for VibeCode page
      if (section && section.classList.contains("aos-animate")) {
        runTyping();
      } else {
        // Try again in 100ms (up to 10 times)
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (section?.classList.contains("aos-animate")) {
            clearInterval(interval);
            runTyping();
          } else if (attempts > 10) {
            clearInterval(interval);
            // Fallback: run anyway
            runTyping();
          }
        }, 100);
      }
    };
  
    // Small initial delay to let render & AOS init
    const timer = setTimeout(checkAOS, 500);
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      // Optional: cleanup — but usually not needed
      if (codeBeforeRef.current) codeBeforeRef.current.innerHTML = "";
      if (codeAfterRef.current) codeAfterRef.current.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Hero Section — Rebranded for Business Owners */}
      <section className="vibe-hero" id="vibe-hero">
        <div className="container">
          <div className="vibe-hero-content">
            <h1 className="vibe-hero-title" data-aos="fade-down">
              نفّذ مشروعك خلال أيام
              <br />
              <span className="highlight">وليس شهور</span>
            </h1>
            <p className="vibe-hero-subtitle" data-aos="fade-up" data-aos-delay="200">
              جرب الفكرة، ثم عدّلها فورًا. بدون مبرمجين، بدون تأخير.
            </p>
            <div className="vibe-hero-buttons" data-aos="fade-up" data-aos-delay="400">
              <a href="#request-form" className="btn btn-primary btn-lg">
                <i className="fas fa-rocket"></i> ابدأ مشروعك الآن
              </a>
              <a href="#comparison" className="btn btn-primary btn-lg">
                <i className="fas fa-play-circle"></i> شاهد الفرق في ٩٠ ثانية
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video Comparison Section */}
      <section className="vibe-video" id="comparison">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">الطريقة التقليدية VS الفايب كود</h2>
            <p className="section-subtitle">فيديو مقارنة مباشر — بدون تعقيد</p>
          </div>
          <div className="video-wrapper" data-aos="zoom-in" data-aos-delay="200">
            {/* 🎬 Replace with real video URL later */}
            <div className="video-placeholder">
              <i className="fas fa-video fa-3x"></i>
              <p>فيديو المقارنة (٩٠ ثانية)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Comparison Section — Animated */}
      <section className="vibe-code-comparison" id="code-demo">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">الفرق من حيث التنفيذ</h2>
            <p className="section-subtitle">كيف يُحوّل الفايب كود الأشهر إلى أيام؟</p>
          </div>
          <div className="code-comparison" data-aos="fade-up" data-aos-delay="200">
            <div className="code-card code-before">
              <div className="code-label">
                <i className="fas fa-times-circle"></i>
                الطريقة التقليدية
              </div>
              <div className="code-block" ref={codeBeforeRef}></div>
            </div>
            <div className="code-card code-after">
              <div className="code-label">
                <i className="fas fa-check-circle"></i>
                الفايب كود
              </div>
              <div className="code-block" ref={codeAfterRef}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies — Social Proof */}
      <section className="vibe-cases" id="case-studies">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">قصص نجاح من عملائنا</h2>
            <p className="section-subtitle">أمثلة واقعية — نفذناها في  ١٠ – ٣٠ يوم</p>
          </div>
          <div className="cases-grid" data-aos="fade-up" data-aos-delay="200">
            <div className="case-card">
              <div className="case-badge">منزلية → مؤسسة</div>
              <h3 className="case-title">منصة "أطباق أم سارة"</h3>
              <p className="case-desc">
                مشروع منزلي لوجبات صحية — حولناه إلى منصة حجوزات وإدارة عملاء خلال ٢٠ يوم.
              </p>
              <div className="case-result">
                <i className="fas fa-chart-line"></i>
                <span>نمو المبيعات ٣٠٠٪ في أول شهر</span>
              </div>
            </div>
            <div className="case-card">
              <div className="case-badge">مؤسسة تعليمية</div>
              <h3 className="case-title">مدرسة "عقلاء المستقبل"</h3>
              <p className="case-desc">
                نظام ذكي لتتبع تقدم الطلاب وإرسال التقارير تلقائيًا — جاهز خلال ٣٠ يوم.
              </p>
              <div className="case-result">
                <i className="fas fa-clock"></i>
                <span>وفرت ٢٠ ساعة أسبوعيًا من العمل اليدوي</span>
              </div>
            </div>
            <div className="case-card">
              <div className="case-badge">متجر إلكتروني</div>
              <h3 className="case-title">متجر "فنون النخيل"</h3>
              <p className="case-desc">
                متجر حرفيين محليين — صُمم ودُمج مع الدفع الإلكتروني خلال ١٠ أيام فقط.
              </p>
              <div className="case-result">
                <i className="fas fa-shopping-cart"></i>
                <span>١٢٧ طلب أول أسبوع</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Portal Section — For Tech Talent */}
      <section className="vibe-dev-portal" id="dev-portal">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">بوابة المبرمجين</h2>
            <p className="section-subtitle">
              إذا كنت مبرمجًا — نريدك شريكًا، لا موظفًا
            </p>
          </div>
          <div className="dev-features" data-aos="fade-up" data-aos-delay="200">
            <div className="dev-feature">
              <div className="dev-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>التوثيق الكامل</h3>
              <p>واجهات برمجة (APIs)، أمثلة، أدلة تكامل مع React/Firebase</p>
            </div>
            <div className="dev-feature">
              <div className="dev-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>مشاريع تدريبية</h3>
              <p>تمارين تطبيقية حقيقية — تُبنى ثم تُنشر على منصتنا</p>
            </div>
            <div className="dev-feature">
              <div className="dev-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>فرص تعاون</h3>
              <p>انضم لفريق "فايب كود" وشارك في مشاريع مدفوعة الأجر</p>
            </div>
          </div>
          <div className="dev-cta" data-aos="fade-up" data-aos-delay="400">
            <a href="#request-form" className="btn btn-secondary">
              <i className="fas fa-code-branch"></i> سجّل كمبرمج متعاون
            </a>
          </div>
        </div>
      </section>

      {/* CTA — Request Form */}
      <section className="vibe-cta" id="request-form">
        <div className="container">
          <div className="cta-content" data-aos="fade-up">
            <h2>جاهز لتحويل فكرتك إلى واقع؟</h2>
            <p>املأ النموذج — وسنعاود الاتصال خلال ٢٤ ساعة لبدء العمل.</p>
            <Link to="/product_request" className="btn btn-primary btn-lg">
              <i className="fas fa-paper-plane"></i> أرسل طلبك الآن
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}