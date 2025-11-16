// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { scrollToSection } from "../utils/scroll";
import { useNavigate } from 'react-router-dom';
import { submitGiftLead } from '../services/api';
import '../styles/products.css';
 import { saveGiftRegistration } from '../services/firebaseService';



// ✅ Product Card Component - خارج Home
const ProductCard = ({ product, navigate, getProductIcon }) => {
  const isAvailable = product.readinessStatus === 'متاح';
  
  const getReleaseDate = () => {
    if (isAvailable) return null;
    const date = new Date(product.createdAt);
    date.setMonth(date.getMonth() + 2);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="product-card-new" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Header with Gradient */}
      <div className="product-header-gradient">
        <div className="product-icon-large">
          <i className={`fas ${getProductIcon(product.subCategory)}`}></i>
        </div>
        
        {/* Status Badge */}
        <div className="status-badge-top">
          <span className={`status-badge ${isAvailable ? 'status-available' : 'status-coming'}`}>
            {isAvailable ? 'متاح الآن' : `قريباً - ${getReleaseDate()}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="product-content-white">
        <h3 className="product-title-new">{product.name}</h3>
        <p className="product-description-new">
          {product.targetAudiences || 'منتج ذكاء اصطناعي متطور'}
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
  
  const description = gift.description || gift.purpose || 'هدية مميزة من منصة وقت الذكاء';
  const shortDescription = description.split('\n').slice(0, 3).join('\n');
  const hasMoreContent = description.split('\n').length > 3 || description.length > 150;

  return (
    <div className="gift-card-new" onClick={() => navigate('/gifts')}>
      {/* Header with Gradient */}
      <div className="gift-header-gradient">
        <div className="gift-icon-large">
          <i className="fas fa-gift"></i>
        </div>
        
        {/* Status Badge */}
        <div className="status-badge-top">
          <span className="status-badge status-gift">
            هدية مجانية
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="gift-content-white">
        <h3 className="gift-title-new">{gift.giftName}</h3>
        
        {/* Description with Show More */}
        <p className="gift-description-new" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: showFullDescription ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '3.4rem'
        }}>
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
              background: 'none',
              border: 'none',
              color: '#8B5CF6',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              padding: '0.5rem 0',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
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
            navigate('/gifts');
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
  const navigate = useNavigate();
  
  // Products & Gifts States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(true);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Refs
  const codeBeforeRef = useRef(null);
  const codeAfterRef = useRef(null);

  // Theme toggle
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user types
    if (formMessage.text) {
      setFormMessage({ type: '', text: '' });
    }
  };

  // Handle form submit

// ... في الـ component

const handleRegister = async (e) => {
  e.preventDefault();
  setFormSubmitting(true);
  setFormMessage({ type: '', text: '' });

  // Validation
  if (!formData.name.trim()) {
    setFormMessage({ type: 'error', text: 'الرجاء إدخال الاسم' });
    setFormSubmitting(false);
    return;
  }

  if (!formData.email.trim() || !formData.email.includes('@')) {
    setFormMessage({ type: 'error', text: 'الرجاء إدخال بريد إلكتروني صحيح' });
    setFormSubmitting(false);
    return;
  }

  if (!formData.phone.match(/^(05|5)[0-9]{8}$/)) {
    setFormMessage({ type: 'error', text: 'رقم الجوال يجب أن يكون بصيغة: 05xxxxxxxx' });
    setFormSubmitting(false);
    return;
  }

  try {
    // ✅ حفظ في Firebase
    const result = await saveGiftRegistration(formData);
    
    console.log('🎉 تم التسجيل بنجاح! Document ID:', result.id);
    
    setFormMessage({ 
      type: 'success', 
      text: '🎉 تم التسجيل بنجاح! سنتواصل معك قريباً'
    });
    
    // Reset form
    setFormData({ name: '', email: '', phone: '' });
    
    // Auto clear message after 5 seconds
    setTimeout(() => {
      setFormMessage({ type: '', text: '' });
    }, 5000);

  } catch (error) {
    console.error('❌ Error:', error);
    setFormMessage({ 
      type: 'error', 
      text: 'حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى'
    });
  } finally {
    setFormSubmitting(false);
  }
};

  const filterVideos = (tab) => {
    setActiveTab(tab);
  };

  // Initial setup
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

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts?limit=6'
        );
        const data = await response.json();
        
        if (data.ok && data.items) {
          setProducts(data.items);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch Gifts
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoadingGifts(true);
        const response = await fetch(
          'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiGifts?limit=6'
        );
        const data = await response.json();
        
        console.log('🎁 Gifts data:', data);
        
        if (data.ok && data.items) {
          console.log('✅ Gifts count:', data.items.length);
          setGifts(data.items);
        }
      } catch (error) {
        console.error('❌ Error fetching gifts:', error);
      } finally {
        setLoadingGifts(false);
      }
    };

    fetchGifts();
  }, []);

  // Typing animation
  const typeText = (element, text, speed = 50) => {
    if (!element) return;
  
    element.innerHTML = "";
    element.style.whiteSpace = "pre";
    element.style.fontFamily = "Consolas, 'Courier New', monospace";
    element.style.fontSize = "0.875rem";
    element.style.lineHeight = "1.5";
  
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "█";
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

  // Trigger typing animation
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

  // Helper functions
  const tabCls = (key) => `tab-btn${activeTab === key ? " active" : ""}`;
  
  const getProductIcon = (subCategory) => {
    const icons = {
      'شركات': 'fa-building',
      'جمعيات': 'fa-hands-helping',
      'أفراد': 'fa-user',
      'أسر منتجة': 'fa-home',
      'default': 'fa-robot'
    };
    return icons[subCategory] || icons.default;
  };

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
              <button 
                onClick={() => navigate('/gifts')} 
                className="btn btn-primary"
              >
                <i className="fas fa-gift"></i> احصل على هديتك الآن
              </button>
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
              onClick={() => navigate('/products?audience=audience_3')}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="category-title">للشركات</div>
              <div className="category-desc">حلول مؤسسية متكاملة</div>
            </div>

            <div
              className="category-item"
              onClick={() => navigate('/products?audience=audience_4')}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="category-title">للأفراد</div>
              <div className="category-desc">طور مهاراتك في الذكاء</div>
            </div>

            <div
              className="category-item"
              onClick={() => navigate('/products?audience=audience_5')}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <div className="category-title">للجمعيات</div>
              <div className="category-desc">حلول للمنظمات غير الربحية</div>
            </div>

            <div
              className="category-item"
              onClick={() => navigate('/products?audience=audience_2')}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">
                <i className="fas fa-code"></i>
              </div>
              <div className="category-title">للمبرمجين</div>
              <div className="category-desc">أدوات وموارد تقنية</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">
            منتجاتنا المميزة
          </h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  navigate={navigate}
                  getProductIcon={getProductIcon}
                />
              ))}
            </div>
          )}

          {/* View All Products Button */}
          <div style={{ textAlign: "center", marginTop: "3rem" }} data-aos="fade-up">
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary"
              style={{ 
                fontSize: "1.1rem", 
                padding: "1rem 3rem",
                cursor: "pointer",
                border: "none"
              }}
            >
              <i className="fas fa-th"></i> عرض جميع المنتجات والخدمات
            </button>
          </div>
        </div>
      </section>

      {/* Free Gifts Section */}
      <section className="gifts-section" id="gifts" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)', padding: '4rem 0' }}>
        <div className="container">
          <div className="gifts-container">
            <div className="section-header" data-aos="fade-up">
              <h2 className="section-title">
                <i className="fas fa-gift"></i>
                ابدأ رحلتك مع الذكاء مجاناً
              </h2>
              <p className="section-subtitle">
                احصل على هدايا قيمة لتبدأ رحلتك في عالم الذكاء الاصطناعي
              </p>
            </div>

            {/* Gifts Grid */}
            {loadingGifts ? (
              <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="spinner"></div>
                <p>جاري تحميل الهدايا...</p>
              </div>
            ) : (
              <div className="gifts-grid" data-aos="fade-up" data-aos-delay="200">
  {gifts.slice(0, 6).map((gift) => {
    console.log('🎁 Rendering gift card:', gift.giftName, gift);
    return <GiftCard key={gift.id} gift={gift} navigate={navigate} />;
  })}
</div>
            )}

            {/* Register Form */}
            <div
              className="register-form"
              data-aos="fade-up"
              data-aos-delay="400"
              style={{ 
                marginTop: '3rem',
                background: 'white',
                padding: '2rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ textAlign: "center", marginBottom: "2rem", color: '#1E293B' }}>
                <i className="fas fa-user-plus"></i> سجل الآن واحصل على هداياك
              </h3>

              {/* Form Message */}
              {formMessage.text && (
                <div style={{
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  background: formMessage.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                  color: formMessage.type === 'success' ? '#065F46' : '#991B1B',
                  fontWeight: '600'
                }}>
                  {formMessage.text}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' }}>
                      الاسم الكامل *
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      placeholder="أدخل اسمك"
                      disabled={formSubmitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #E2E8F0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontFamily: 'Tajawal, sans-serif',
                        transition: 'all 0.3s'
                      }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' }}>
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                      disabled={formSubmitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #E2E8F0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontFamily: 'Tajawal, sans-serif',
                        transition: 'all 0.3s'
                      }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' }}>
                      رقم الواتساب *
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                      placeholder="05xxxxxxxx"
                      pattern="^(05|5)[0-9]{8}$"
                      disabled={formSubmitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #E2E8F0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontFamily: 'Tajawal, sans-serif',
                        direction: 'ltr',
                        textAlign: 'right',
                        transition: 'all 0.3s'
                      }}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: '1rem',
                    fontSize: '1.1rem',
                    background: formSubmitting ? '#9CA3AF' : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontWeight: '700',
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {formSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-gift"></i> احصل على هداياك الآن
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* View All Gifts Button */}
            <div style={{ textAlign: "center", marginTop: "2rem" }} data-aos="fade-up">
              <button
                onClick={() => navigate('/gifts')}
                className="btn btn-secondary"
                style={{ 
                  fontSize: "1rem", 
                  padding: "0.75rem 2rem",
                  cursor: "pointer",
                  border: "2px solid #8B5CF6",
                  background: "transparent",
                  color: "#8B5CF6",
                  borderRadius: "50px",
                  fontWeight: "600",
                  transition: "all 0.3s"
                }}
              >
                <i className="fas fa-arrow-left"></i> عرض جميع الهدايا
              </button>
            </div>
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
                  <i className="fas fa-check-circle"></i>
                  <span>أتمتة كاملة</span>
                </div>
                <div className="vibe-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>توفير 80% من الوقت</span>
                </div>
                <div className="vibe-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>برمجة ذكية</span>
                </div>
                <div className="vibe-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>تطوير سريع</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/products')} 
                className="btn btn-secondary"
              >
                <i className="fas fa-arrow-left"></i> اكتشف المزيد
              </button>
            </div>

            <div className="code-comparison">
              <div className="code-before">
                <div className="code-label">
                  <i className="fas fa-clock"></i> قبل: برمجة تقليدية
                </div>
                <div className="code-block" ref={codeBeforeRef}></div>
              </div>

              <div className="code-after">
                <div className="code-label">
                  <i className="fas fa-bolt"></i> بعد: الفايب كود
                </div>
                <div className="code-block" ref={codeAfterRef}></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Free Gifts Section */}
      <section className="gifts-section" id="gifts">
        <div className="container">
          <div className="gifts-container">
            {/*<div className="section-header" data-aos="fade-up">
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
            </div>*/}

            <div
              className="register-form"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>
                خاص بالاستفسارات
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
            <h2 className="section-title">مكتبة الفيديوهات</h2>
            <p className="section-subtitle">
              شاهد دروس ومحتوى مميز عن الذكاء الاصطناعي
            </p>
          </div>

          <div className="video-tabs" data-aos="fade-up" data-aos-delay="100">
            <button className={tabCls("all")} onClick={() => filterVideos("all")}>
              الكل
            </button>
            <button
              className={tabCls("tutorials")}
              onClick={() => filterVideos("tutorials")}
            >
              دروس تعليمية
            </button>
            <button
              className={tabCls("reviews")}
              onClick={() => filterVideos("reviews")}
            >
              مراجعات
            </button>
            <button className={tabCls("tips")} onClick={() => filterVideos("tips")}>
              نصائح
            </button>
          </div>

          <div className="videos-grid">
            <div
              className="video-card"
              data-aos="fade-up"
              data-aos-delay="200"
              style={{
                display:
                  activeTab === "all" || activeTab === "tutorials" ? "block" : "none",
              }}
            >
              <div className="video-thumbnail">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="فيديو 1"
                ></iframe>
              </div>
              <div className="video-info">
                <h3>مقدمة في ChatGPT للمبتدئين</h3>
                <p className="video-meta">
                  <i className="fas fa-play-circle"></i> 10K مشاهدة • منذ أسبوع
                </p>
              </div>
            </div>

            <div
              className="video-card"
              data-aos="fade-up"
              data-aos-delay="300"
              style={{
                display:
                  activeTab === "all" || activeTab === "reviews" ? "block" : "none",
              }}
            >
              <div className="video-thumbnail">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="فيديو 2"
                ></iframe>
              </div>
              <div className="video-info">
                <h3>مراجعة شاملة لـ Claude AI</h3>
                <p className="video-meta">
                  <i className="fas fa-play-circle"></i> 8K مشاهدة • منذ 3 أيام
                </p>
              </div>
            </div>

            <div
              className="video-card"
              data-aos="fade-up"
              data-aos-delay="400"
              style={{
                display:
                  activeTab === "all" || activeTab === "tips" ? "block" : "none",
              }}
            >
              <div className="video-thumbnail">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="فيديو 3"
                ></iframe>
              </div>
              <div className="video-info">
                <h3>5 نصائح لكتابة Prompts أفضل</h3>
                <p className="video-meta">
                  <i className="fas fa-play-circle"></i> 15K مشاهدة • منذ يومين
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section" id="news">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">أخبار الذكاء الاصطناعي</h2>
            <p className="section-subtitle">
              تابع آخر التطورات في عالم الذكاء الاصطناعي
            </p>
          </div>

          <div className="news-layout">
            <div className="featured-news">
              <article
                className="featured-article"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="featured-image">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="featured-content">
                  <span className="news-category">
                    <i className="fas fa-tag"></i> أبرز الأخبار
                  </span>
                  <h2 className="featured-title">
                    OpenAI تطلق GPT-4 Turbo بإمكانيات جديدة
                  </h2>
                  <p className="featured-excerpt">
                    أطلقت OpenAI النسخة الجديدة من GPT-4 Turbo مع تحسينات
                    كبيرة في السرعة والدقة...
                  </p>
                  <div className="news-meta">
                    <div className="news-author">
                      <div className="author-avatar">م</div>
                      <span>محمد أحمد</span>
                    </div>
                    <span>منذ ساعتين</span>
                  </div>
                </div>
              </article>

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
    </>
  );
}