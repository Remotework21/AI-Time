// src/pages/Contact.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { saveContactInquiry } from "../services/firebaseService"; // ✅ ADDED IMPORT
import "../styles/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "استفسار عام",
    subjectLine: "", // ⚠️ added to match form input
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔴 for loading state

  const subjects = [
    "استفسار عام",
    "طلب عرض سعر",
    "دعم فني",
    "شراكة أعمال",
    "اقتراح أو شكوى",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 🚧 disable & show loading

    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        subject: formData.subject,
        subjectLine: formData.subjectLine,
        message: formData.message,
      };

      await saveContactInquiry(dataToSubmit);

      // ✔️ Success
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: subjects[0],
        subjectLine: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      alert("حدث خطأ أثناء الإرسال: " + (error.message || "يرجى المحاولة لاحقاً"));
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Share handler (reused from FloatingBtn logic)
  const sharePage = (platform) => {
    const url = window.location.href;
    const title = "تواصل مع منصة وقت الذكاء";
    const text = "تواصل معنا للحصول على حلول الذكاء الاصطناعي المبتكرة";
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="page-hero" data-aos="fade-up">
        <div className="container">
          <h1 className="page-title">تواصل معنا</h1>
          <p className="page-subtitle">نحن هنا لمساعدتك ودعمك في كل خطوة</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="info-cards-grid">
            {/* Phone */}
            <div className="info-card" data-aos="fade-up" data-aos-delay="100">
              <div className="info-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3 className="info-title">اتصل بنا</h3>
              <p className="info-content">متاحون من الأحد للخميس</p>
              <a href="tel:+966500000000" className="info-link">
                +966 50 000 0000
              </a>
            </div>
            {/* Email */}
            <div className="info-card" data-aos="fade-up" data-aos-delay="200">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="info-title">راسلنا</h3>
              <p className="info-content">نرد خلال 24 ساعة</p>
              <a href="mailto:info@ai-time.sa" className="info-link">
                info@ai-time.sa
              </a>
            </div>
            {/* WhatsApp */}
            <div className="info-card" data-aos="fade-up" data-aos-delay="300">
              <div className="info-icon">
                <i className="fab fa-whatsapp"></i>
              </div>
              <h3 className="info-title">واتساب</h3>
              <p className="info-content">للدعم الفوري</p>
              <a
                href="https://wa.me/966500000000"
                className="info-link"
                target="_blank"
                rel="noreferrer"
              >
                ابدأ المحادثة
              </a>
            </div>
            {/* Location */}
            <div className="info-card" data-aos="fade-up" data-aos-delay="400">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="info-title">موقعنا</h3>
              <p className="info-content">جدة، المملكة العربية السعودية</p>
              <a href="#map" className="info-link">
                عرض الخريطة
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            {/* Form Side */}
            <div className="form-side" data-aos="fade-right">
              <h2 className="form-title">أرسل لنا رسالة</h2>
              <p className="form-subtitle">
                سنسعد بالتواصل معك والإجابة على جميع استفساراتك
              </p>
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">الاسم *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك "
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      className="form-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input
                      type="tel"
                      className="form-input"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">نوع الاستفسار</label>
                    <select
                      className="form-select"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      {subjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">الموضوع *</label>
                  <input
                    type="text"
                    className="form-input"
                    name="subjectLine"
                    value={formData.subjectLine}
                    onChange={handleChange}
                    placeholder="موضوع الرسالة"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الرسالة *</label>
                  <textarea
                    className="form-textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="اكتب رسالتك هنا..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> إرسال الرسالة
                    </>
                  )}
                </button>
                {isSubmitted && (
                  <div className="success-message show">
                    <i className="fas fa-check-circle"></i> تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                  </div>
                )}
              </form>
            </div>

            {/* Map Side */}
            <div className="map-side" data-aos="fade-left">
              <div className="map-container" id="map">
                <iframe
                  title="AI Time Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.151925213981!2d39.18079277506018!3d21.543341780240677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d4b3d3240001%3A0x2a7b9c8f7e9c7b8a!2z2KfYrtix2LnZiNiv2YjYp9mGINin2YTYqNmH2KfYqiDYp9mE2KjZhyDYp9mE2KjZhyDZhNmE2YXYs9mHINmF2KfZhNi52YjYp9mGINin2YTYqNmH2KfYqg!5e0!3m2!1sar!2ssa!4v1723456789012!5m2!1sar!2ssa"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="office-info">
                <h3 className="office-title">المكتب الرئيسي</h3>
                <div className="office-item">
                  <i className="fas fa-building"></i>
                  <div>
                    <strong>العنوان:</strong>
                    <br />
                    شارع الأمير محمد بن عبد العزيز (التحلية)، جدة 23424
                    <br />
                    المملكة العربية السعودية
                  </div>
                </div>
                <div className="office-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <strong>الهاتف:</strong>
                    <br />
                    <a href="tel:+966120000000">+966 12 000 0000</a>
                    <br />
                    <a href="tel:+966500000000">+966 50 000 0000</a>
                  </div>
                </div>
                <div className="office-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <strong>البريد الإلكتروني:</strong>
                    <br />
                    <a href="mailto:info@ai-time.sa">info@ai-time.sa</a>
                    <br />
                    <a href="mailto:support@ai-time.sa">support@ai-time.sa</a>
                  </div>
                </div>
                <div className="working-hours">
                  <h4 className="hours-title">ساعات العمل</h4>
                  <div className="hours-item">
                    <span>الأحد - الخميس</span>
                    <span>9:00 ص - 6:00 م</span>
                  </div>
                  <div className="hours-item">
                    <span>الجمعة - السبت</span>
                    <span>مغلق</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="share-section" data-aos="fade-up">
            <h3 className="share-title">شارك صفحة التواصل مع أصدقائك</h3>
            <div className="share-buttons">
              {[
                { platform: "facebook", cls: "social-facebook", icon: "fab fa-facebook-f" },
                { platform: "twitter", cls: "social-twitter", icon: "fab fa-twitter" },
                { platform: "whatsapp", cls: "social-whatsapp", icon: "fab fa-whatsapp" },
                { platform: "linkedin", cls: "social-linkedin", icon: "fab fa-linkedin-in" },
              ].map((btn) => (
                <button
                  key={btn.platform}
                  className={`share-btn ${btn.cls}`}
                  onClick={() => sharePage(btn.platform)}
                  aria-label={`شارك على ${btn.platform}`}
                >
                  <i className={btn.icon}></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="social-section">
        <div className="container">
          <h2 className="social-title" data-aos="fade-up">
            تابعنا على السوشيال ميديا
          </h2>
          <p className="social-subtitle" data-aos="fade-up">
            كن على اطلاع بآخر أخبارنا وعروضنا
          </p>
          <div className="social-links" data-aos="fade-up" data-aos-delay="100">
            {[
              { href: "#", cls: "social-facebook", icon: "fab fa-facebook-f" },
              { href: "#", cls: "social-twitter", icon: "fab fa-twitter" },
              { href: "#", cls: "social-instagram", icon: "fab fa-instagram" },
              { href: "#", cls: "social-linkedin", icon: "fab fa-linkedin-in" },
              { href: "#", cls: "social-youtube", icon: "fab fa-youtube" },
              {
                href: "https://wa.me/966500000000",
                cls: "social-whatsapp",
                icon: "fab fa-whatsapp",
                target: "_blank",
              },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className={`social-link ${link.cls}`}
                target={link.target || "_blank"}
                rel="noreferrer"
                aria-label={link.cls.split("-")[1]}
              >
                <i className={link.icon}></i>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="faq-mini-section">
        <div className="container">
          <h2 className="faq-title" data-aos="fade-up">
            أسئلة شائعة
          </h2>
          <div className="faq-grid">
            {[
              {
                q: "كم يستغرق الرد على الاستفسارات؟",
                a: "نسعى للرد خلال 24 ساعة كحد أقصى، وفي الحالات العاجلة يمكنك التواصل معنا عبر واتساب للحصول على رد فوري.",
              },
              {
                q: "هل تقدمون استشارات مجانية؟",
                a: "نعم، نقدم استشارة أولية مجانية لمدة 30 دقيقة لمناقشة احتياجاتك.",
              },
              {
                q: "هل يمكن زيارة مكتبكم؟",
                a: "بالطبع! نرحب بزيارتك في مكتبنا بجدة. يُفضل حجز موعد مسبق.",
              },
              {
                q: "هل تقدمون خدماتكم خارج السعودية؟",
                a: "نعم، نقدم خدماتنا لجميع دول الخليج والشرق الأوسط.",
              },
            ].map((faq, i) => (
              <div
                className="faq-card"
                key={i}
                data-aos="fade-up"
                data-aos-delay={(i + 1) * 100}
              >
                <h4 className="faq-question">{faq.q}</h4>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}