// src/pages/VibeCode.jsx - Enhanced Version
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/vibecode.css";

export default function VibeCode() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState('before');

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      {/* 🎯 Hero Section - محسّن */}
      <section className="vibe-hero-enhanced">
        <div className="hero-bg-animation">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content-wrapper">
            <div className="hero-badge" data-aos="fade-down">
              <i className="fas fa-bolt"></i>
              <span>تطوير سريع - نتائج فورية</span>
            </div>
            
            <h1 className="hero-title-xl" data-aos="fade-up" data-aos-delay="100">
              حوّل فكرتك إلى منصة رقمية
              <br />
              <span className="gradient-text">في أيام معدودة</span>
            </h1>
            
            <p className="hero-subtitle-xl" data-aos="fade-up" data-aos-delay="200">
              لا تنتظر شهوراً! نبني لك منصتك الإلكترونية بتقنية الذكاء الاصطناعي
              <br />
              <strong>بسرعة × تكلفة معقولة × جودة عالية</strong>
            </p>
            
            <div className="hero-stats" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-item">
                <div className="stat-number">٧ أيام</div>
                <div className="stat-label">متوسط وقت التسليم</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">٧٠٪</div>
                <div className="stat-label">توفير في التكلفة</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">٥٠+</div>
                <div className="stat-label">مشروع ناجح</div>
              </div>
            </div>
            
            <div className="hero-cta-buttons" data-aos="fade-up" data-aos-delay="400">
              <Link to="/product_request" className="btn-hero-primary">
                <i className="fas fa-rocket"></i>
                <span>ابدأ مشروعك الآن</span>
                <div className="btn-shine"></div>
              </Link>
              <a href="#how-it-works" className="btn-hero-secondary">
                <i className="fas fa-play-circle"></i>
                <span>كيف يعمل؟</span>
              </a>
            </div>
            
            <div className="hero-trust-badges" data-aos="fade-up" data-aos-delay="500">
              <div className="trust-badge">
                <i className="fas fa-check-circle"></i>
                <span>ضمان الجودة</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                <span>دعم فني مستمر</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-sync-alt"></i>
                <span>تعديلات مجانية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 كيف يعمل - خطوات واضحة */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header-center" data-aos="fade-up">
            <span className="section-badge">العملية</span>
            <h2 className="section-title-xl">من الفكرة إلى المنصة في ٤ خطوات</h2>
            <p className="section-subtitle">عملية بسيطة وسريعة - بدون تعقيدات</p>
          </div>
          
          <div className="steps-timeline" data-aos="fade-up" data-aos-delay="200">
            <div className="step-item">
              <div className="step-number">١</div>
              <div className="step-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="step-title">شاركنا فكرتك</h3>
              <p className="step-desc">
                احكي لنا عن فكرة مشروعك والمميزات اللي تحتاجها.
                نناقش معك التفاصيل ونفهم احتياجاتك بالضبط
              </p>
              <div className="step-time">٢٤ ساعة</div>
            </div>
            
            <div className="step-arrow">
              <i className="fas fa-arrow-left"></i>
            </div>
            
            <div className="step-item">
              <div className="step-number">٢</div>
              <div className="step-icon">
                <i className="fas fa-pencil-ruler"></i>
              </div>
              <h3 className="step-title">نصمم ونخطط</h3>
              <p className="step-desc">
                نرسم تصميم المنصة ونعرضه عليك للموافقة.
                نخطط قاعدة البيانات والمميزات الأساسية
              </p>
              <div className="step-time">٢-٣ أيام</div>
            </div>
            
            <div className="step-arrow">
              <i className="fas fa-arrow-left"></i>
            </div>
            
            <div className="step-item">
              <div className="step-number">٣</div>
              <div className="step-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3 className="step-title">نطور بالذكاء الاصطناعي</h3>
              <p className="step-desc">
                نستخدم أدوات ذكاء اصطناعي متقدمة لبناء المنصة بسرعة فائقة.
                تطوير احترافي بربع الوقت التقليدي
              </p>
              <div className="step-time">٣-٥ أيام</div>
            </div>
            
            <div className="step-arrow">
              <i className="fas fa-arrow-left"></i>
            </div>
            
            <div className="step-item">
              <div className="step-number">٤</div>
              <div className="step-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3 className="step-title">نسلّم ونطلق</h3>
              <p className="step-desc">
                نسلمك المنصة جاهزة للاستخدام مع التدريب والدعم الفني.
                منصتك جاهزة للانطلاق!
              </p>
              <div className="step-time">يوم واحد</div>
            </div>
          </div>
          
          <div className="process-summary" data-aos="fade-up" data-aos-delay="400">
            <div className="summary-card">
              <i className="fas fa-clock"></i>
              <h4>الوقت الإجمالي</h4>
              <p className="highlight-lg">٧-١٠ أيام</p>
              <span className="vs-text">بدلاً من ٢-٤ شهور</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 المميزات الرئيسية */}
      <section className="vibe-features-enhanced">
        <div className="container">
          <div className="section-header-center" data-aos="fade-up">
            <span className="section-badge">المميزات</span>
            <h2 className="section-title-xl">لماذا فايب كود؟</h2>
            <p className="section-subtitle">حلول شاملة لجميع احتياجاتك الرقمية</p>
          </div>
          
          <div className="features-grid-modern" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>سرعة خيالية</h3>
              <p>
                نستخدم أحدث تقنيات الذكاء الاصطناعي لتسريع التطوير.
                ما كان يأخذ شهور، نخلصه في أيام
              </p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3>تكلفة معقولة</h3>
              <p>
                وفر ٧٠٪ من تكاليف التطوير التقليدي.
                أسعار شفافة وباقات مرنة تناسب ميزانيتك
              </p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>متوافق مع الجوال</h3>
              <p>
                تصميم متجاوب يعمل بكفاءة على جميع الأجهزة.
                تجربة مستخدم ممتازة على الجوال والتابلت
              </p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>أمان عالي</h3>
              <p>
                حماية بيانات متقدمة على Firebase.
                نسخ احتياطي تلقائي وحماية من الاختراق
              </p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>تحديثات مستمرة</h3>
              <p>
                نضيف مميزات جديدة ونحسن الأداء باستمرار.
                تطوير مستمر لمواكبة احتياجاتك
              </p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <i className="fas fa-headset"></i>
              </div>
              <h3>دعم فني ٢٤/٧</h3>
              <p>
                فريقنا متواجد دائماً لمساعدتك وحل أي مشكلة.
                رد سريع وحلول فعّالة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 مقارنة Before/After */}
      <section className="before-after-section">
        <div className="container">
          <div className="section-header-center" data-aos="fade-up">
            <span className="section-badge">المقارنة</span>
            <h2 className="section-title-xl">الطريقة التقليدية VS فايب كود</h2>
            <p className="section-subtitle">شوف الفرق بنفسك!</p>
          </div>
          
          <div className="comparison-toggle" data-aos="fade-up" data-aos-delay="200">
            <button 
              className={`toggle-btn ${showBeforeAfter === 'before' ? 'active' : ''}`}
              onClick={() => setShowBeforeAfter('before')}
            >
              <i className="fas fa-times-circle"></i>
              الطريقة التقليدية
            </button>
            <button 
              className={`toggle-btn ${showBeforeAfter === 'after' ? 'active' : ''}`}
              onClick={() => setShowBeforeAfter('after')}
            >
              <i className="fas fa-check-circle"></i>
              فايب كود
            </button>
          </div>
          
          <div className="comparison-content" data-aos="zoom-in" data-aos-delay="300">
            {showBeforeAfter === 'before' ? (
              <div className="comparison-card before-card">
                <div className="comparison-header">
                  <i className="fas fa-times-circle"></i>
                  <h3>الطريقة التقليدية</h3>
                </div>
                <ul className="comparison-list">
                  <li>
                    <i className="fas fa-hourglass-half"></i>
                    <div>
                      <strong>الوقت:</strong>
                      <span>٢-٤ شهور من جمع المتطلبات للتسليم</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-money-bill-wave"></i>
                    <div>
                      <strong>التكلفة:</strong>
                      <span>٢٠,٠٠٠ - ٥٠,٠٠٠ ريال وأكثر</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-users"></i>
                    <div>
                      <strong>الفريق:</strong>
                      <span>مصمم + مطور frontend + مطور backend + مختبر</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-edit"></i>
                    <div>
                      <strong>التعديلات:</strong>
                      <span>تكلفة إضافية لكل تعديل</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-tools"></i>
                    <div>
                      <strong>الصيانة:</strong>
                      <span>عقد صيانة منفصل بتكلفة شهرية</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-exclamation-triangle"></i>
                    <div>
                      <strong>المخاطر:</strong>
                      <span>احتمال تأخير أو تجاوز الميزانية</span>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="comparison-card after-card">
                <div className="comparison-header">
                  <i className="fas fa-check-circle"></i>
                  <h3>فايب كود</h3>
                </div>
                <ul className="comparison-list">
                  <li>
                    <i className="fas fa-rocket"></i>
                    <div>
                      <strong>الوقت:</strong>
                      <span>٧-١٠ أيام من الفكرة للإطلاق</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-piggy-bank"></i>
                    <div>
                      <strong>التكلفة:</strong>
                      <span>٥,٠٠٠ - ١٥,٠٠٠ ريال (وفر ٧٠٪)</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-user-tie"></i>
                    <div>
                      <strong>الفريق:</strong>
                      <span>مدير مشروع واحد + ذكاء اصطناعي</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-gift"></i>
                    <div>
                      <strong>التعديلات:</strong>
                      <span>٣ جولات تعديلات مجانية</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-life-ring"></i>
                    <div>
                      <strong>الصيانة:</strong>
                      <span>شهر دعم فني مجاني بعد التسليم</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-double"></i>
                    <div>
                      <strong>الضمان:</strong>
                      <span>ضمان الجودة ١٠٠٪ أو استرجاع المبلغ</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🎯 شهادات العملاء */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header-center" data-aos="fade-up">
            <span className="section-badge">آراء العملاء</span>
            <h2 className="section-title-xl">ماذا يقول عملاؤنا؟</h2>
            <p className="section-subtitle">قصص نجاح حقيقية من رواد أعمال مثلك</p>
          </div>
          
          <div className="testimonials-grid" data-aos="fade-up" data-aos-delay="200">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="client-info">
                  <h4>أحمد العتيبي</h4>
                  <p>صاحب مطعم "بيت الشاورما"</p>
                </div>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="testimonial-text">
                "كنت محتاج منصة طلبات أونلاين بسرعة. فايب كود سلموني المنصة في ٨ أيام فقط! 
                المبيعات زادت ٤٥٪ في أول شهر. خدمة ممتازة وسعر معقول جداً"
              </p>
              <div className="testimonial-result">
                <i className="fas fa-chart-line"></i>
                <span>زيادة المبيعات ٤٥٪</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="client-info">
                  <h4>فاطمة السالم</h4>
                  <p>مديرة مركز "براعم المستقبل"</p>
                </div>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="testimonial-text">
                "نظام إدارة الطلاب اللي بنوه لنا وفر علينا ساعات من العمل اليدوي. 
                التواصل مع أولياء الأمور صار أسهل، والتقارير تطلع تلقائياً. أنصح فيهم بقوة!"
              </p>
              <div className="testimonial-result">
                <i className="fas fa-clock"></i>
                <span>توفير ١٥ ساعة أسبوعياً</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="client-info">
                  <h4>خالد المطيري</h4>
                  <p>مؤسس متجر "تقنية برو"</p>
                </div>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="testimonial-text">
                "متجري الإلكتروني صار جاهز في ١٠ أيام بس! التصميم احترافي، 
                النظام سهل الاستخدام، والأهم: سعرهم أقل من المنافسين بمراحل. شكراً فايب كود"
              </p>
              <div className="testimonial-result">
                <i className="fas fa-shopping-cart"></i>
                <span>٢٠٠+ طلب أول شهر</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 الباقات والأسعار */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header-center" data-aos="fade-up">
            <span className="section-badge">الباقات</span>
            <h2 className="section-title-xl">اختر الباقة المناسبة لك</h2>
            <p className="section-subtitle">أسعار شفافة بدون مفاجآت</p>
          </div>
          
          <div className="pricing-grid" data-aos="fade-up" data-aos-delay="200">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>الباقة الأساسية</h3>
                <div className="price">
                  <span className="currency">ريال</span>
                  <span className="amount">٥,٠٠٠</span>
                </div>
                <p className="price-desc">مناسبة للمشاريع الصغيرة</p>
              </div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> حتى ٥ صفحات</li>
                <li><i className="fas fa-check"></i> تصميم متجاوب</li>
                <li><i className="fas fa-check"></i> لوحة تحكم بسيطة</li>
                <li><i className="fas fa-check"></i> استضافة لمدة سنة</li>
                <li><i className="fas fa-check"></i> دعم فني شهر</li>
                <li><i className="fas fa-check"></i> جولة تعديلات واحدة</li>
              </ul>
              <Link to="/product_request" className="pricing-btn">
                اطلب الآن
              </Link>
            </div>
            
            <div className="pricing-card featured">
              <div className="popular-badge">الأكثر طلباً</div>
              <div className="pricing-header">
                <h3>الباقة الاحترافية</h3>
                <div className="price">
                  <span className="currency">ريال</span>
                  <span className="amount">١٠,٠٠٠</span>
                </div>
                <p className="price-desc">مناسبة لمعظم المشاريع</p>
              </div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> حتى ١٠ صفحات</li>
                <li><i className="fas fa-check"></i> تصميم متقدم</li>
                <li><i className="fas fa-check"></i> لوحة تحكم متقدمة</li>
                <li><i className="fas fa-check"></i> قاعدة بيانات Firebase</li>
                <li><i className="fas fa-check"></i> استضافة لمدة سنة</li>
                <li><i className="fas fa-check"></i> دعم فني ٣ شهور</li>
                <li><i className="fas fa-check"></i> ٣ جولات تعديلات</li>
                <li><i className="fas fa-check"></i> تكامل مع واتساب</li>
              </ul>
              <Link to="/product_request" className="pricing-btn">
                اطلب الآن
              </Link>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>الباقة المتقدمة</h3>
                <div className="price">
                  <span className="currency">ريال</span>
                  <span className="amount">١٥,٠٠٠</span>
                </div>
                <p className="price-desc">للمشاريع الكبيرة</p>
              </div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> صفحات غير محدودة</li>
                <li><i className="fas fa-check"></i> تصميم مخصص كامل</li>
                <li><i className="fas fa-check"></i> نظام إدارة متكامل</li>
                <li><i className="fas fa-check"></i> قاعدة بيانات متقدمة</li>
                <li><i className="fas fa-check"></i> استضافة لمدة سنة</li>
                <li><i className="fas fa-check"></i> دعم فني ٦ شهور</li>
                <li><i className="fas fa-check"></i> تعديلات غير محدودة</li>
                <li><i className="fas fa-check"></i> تكامل مع APIs خارجية</li>
                <li><i className="fas fa-check"></i> تطبيق جوال (PWA)</li>
              </ul>
              <Link to="/product_request" className="pricing-btn">
                اطلب الآن
              </Link>
            </div>
          </div>
          
          <div className="pricing-note" data-aos="fade-up" data-aos-delay="400">
            <i className="fas fa-info-circle"></i>
            <p>جميع الأسعار شاملة الضريبة. يمكن تخصيص أي باقة حسب احتياجاتك</p>
          </div>
        </div>
      </section>

      {/* 🎯 أسئلة شائعة */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header-center" data-aos="fade-up">
            <span className="section-badge">الأسئلة الشائعة</span>
            <h2 className="section-title-xl">عندك أسئلة؟ عندنا الإجابات</h2>
          </div>
          
          <div className="faq-wrapper" data-aos="fade-up" data-aos-delay="200">
            <div className="faq-item">
              <button 
                className={`faq-question ${activeFAQ === 0 ? 'active' : ''}`}
                onClick={() => toggleFAQ(0)}
              >
                <span>كم يستغرق بناء المنصة؟</span>
                <i className={`fas fa-chevron-${activeFAQ === 0 ? 'up' : 'down'}`}></i>
              </button>
              <div className={`faq-answer ${activeFAQ === 0 ? 'show' : ''}`}>
                <p>
                  المدة تعتمد على حجم المشروع، لكن في المتوسط:
                  <br />• الباقة الأساسية: ٥-٧ أيام
                  <br />• الباقة الاحترافية: ٧-١٠ أيام  
                  <br />• الباقة المتقدمة: ١٠-١٥ يوم
                  <br />نبدأ العمل فور الاتفاق والدفعة الأولى
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <button 
                className={`faq-question ${activeFAQ === 1 ? 'active' : ''}`}
                onClick={() => toggleFAQ(1)}
              >
                <span>هل المنصة ملك لي بالكامل؟</span>
                <i className={`fas fa-chevron-${activeFAQ === 1 ? 'up' : 'down'}`}></i>
              </button>
              <div className={`faq-answer ${activeFAQ === 1 ? 'show' : ''}`}>
                <p>
                  نعم ١٠٠٪! بعد التسليم، المنصة والكود المصدري يصبح ملكك الكامل. 
                  نسلمك جميع الملفات وصلاحيات الوصول الكاملة. 
                  يمكنك تطويرها لاحقاً أو نقلها لأي جهة أخرى بحرية تامة.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <button 
                className={`faq-question ${activeFAQ === 2 ? 'active' : ''}`}
                onClick={() => toggleFAQ(2)}
              >
                <span>ماذا لو احتجت تعديلات بعد التسليم؟</span>
                <i className={`fas fa-chevron-${activeFAQ === 2 ? 'up' : 'down'}`}></i>
              </button>
              <div className={`faq-answer ${activeFAQ === 2 ? 'show' : ''}`}>
                <p>
                  نقدم لك فترة دعم فني مجاني (تختلف حسب الباقة) لإصلاح أي مشاكل تقنية.
                  التعديلات الإضافية أو المميزات الجديدة يمكن طلبها بأسعار تنافسية.
                  نقدم أيضاً باقات صيانة شهرية اختيارية.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <button 
                className={`faq-question ${activeFAQ === 3 ? 'active' : ''}`}
                onClick={() => toggleFAQ(3)}
              >
                <span>كيف تكون الأسعار منخفضة جداً؟</span>
                <i className={`fas fa-chevron-${activeFAQ === 3 ? 'up' : 'down'}`}></i>
              </button>
              <div className={`faq-answer ${activeFAQ === 3 ? 'show' : ''}`}>
                <p>
                  نستخدم أدوات ذكاء اصطناعي متقدمة تسرع عملية التطوير بشكل كبير.
                  هذا يقلل الوقت المستغرق من شهور إلى أيام، مما يخفض التكلفة.
                  بدلاً من فريق كامل، نحتاج مدير مشروع واحد + أدوات ذكية = توفير ٧٠٪ من التكلفة!
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <button 
                className={`faq-question ${activeFAQ === 4 ? 'active' : ''}`}
                onClick={() => toggleFAQ(4)}
              >
                <span>هل يمكنني رؤية أمثلة سابقة؟</span>
                <i className={`fas fa-chevron-${activeFAQ === 4 ? 'up' : 'down'}`}></i>
              </button>
              <div className={`faq-answer ${activeFAQ === 4 ? 'show' : ''}`}>
                <p>
                  بالتأكيد! لدينا معرض أعمال يحتوي على أكثر من ٥٠ مشروع ناجح.
                  يمكنك طلب رؤية نماذج مشابهة لفكرتك عند التواصل معنا.
                  نحترم خصوصية عملائنا، لذا بعض المشاريع لا نستطيع عرضها علناً.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <button 
                className={`faq-question ${activeFAQ === 5 ? 'active' : ''}`}
                onClick={() => toggleFAQ(5)}
              >
                <span>ما هي طريقة الدفع؟</span>
                <i className={`fas fa-chevron-${activeFAQ === 5 ? 'up' : 'down'}`}></i>
              </button>
              <div className={`faq-answer ${activeFAQ === 5 ? 'show' : ''}`}>
                <p>
                  نعمل بنظام دفعات مرنة:
                  <br />• ٥٠٪ عند بدء المشروع
                  <br />• ٣٠٪ عند عرض التصميم والموافقة عليه
                  <br />• ٢٠٪ عند التسليم النهائي
                  <br />نقبل التحويل البنكي وجميع وسائل الدفع الإلكتروني
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 CTA النهائي */}
      <section className="final-cta-section">
        <div className="cta-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="container">
          <div className="cta-content-final" data-aos="zoom-in">
            <div className="cta-icon-large">
              <i className="fas fa-rocket"></i>
            </div>
            <h2 className="cta-title-xl">جاهز لتحويل فكرتك إلى واقع؟</h2>
            <p className="cta-subtitle-xl">
              لا تضيع وقتك! ابدأ مشروعك اليوم وشوف النتائج في أسبوع
            </p>
            
            <div className="cta-benefits">
              <div className="cta-benefit">
                <i className="fas fa-check-circle"></i>
                <span>استشارة مجانية</span>
              </div>
              <div className="cta-benefit">
                <i className="fas fa-check-circle"></i>
                <span>عرض سعر فوري</span>
              </div>
              <div className="cta-benefit">
                <i className="fas fa-check-circle"></i>
                <span>بدء سريع</span>
              </div>
            </div>
            
            <Link to="/product_request" className="btn-cta-final">
              <i className="fas fa-paper-plane"></i>
              <span>ابدأ مشروعك الآن - مجاناً</span>
              <div className="btn-shine"></div>
            </Link>
            
            <p className="cta-note">
              <i className="fas fa-shield-alt"></i>
              لا تحتاج بطاقة ائتمانية • رد خلال ٢٤ ساعة
            </p>
          </div>
        </div>
      </section>
    </>
  );
}