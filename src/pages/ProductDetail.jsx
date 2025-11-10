// ProductDetail.jsx
// صفحة تفاصيل المنتج الكاملة
// API: https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('features');
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  // API: جلب المنتج
  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // جلب جميع المنتجات
      const response = await fetch(
        'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts?limit=200'
      );
      
      if (!response.ok) {
        throw new Error('فشل تحميل المنتج');
      }
      
      const data = await response.json();
      
      if (data.ok && data.items) {
        // البحث عن المنتج المطلوب
        const foundProduct = data.items.find(item => item.id === id);
        
        if (!foundProduct) {
          setError('المنتج غير موجود');
          return;
        }
        
        setProduct(foundProduct);
        
        // جلب المنتجات ذات الصلة
        if (foundProduct.subCategory) {
          const related = data.items
            .filter(p => p.id !== id && p.subCategory === foundProduct.subCategory)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المنتج');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    if (!price || price === 0) return 'مجاني';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // التواصل عبر واتساب
  const handleWhatsAppContact = () => {
    const message = `مرحباً، أريد الاستفسار عن منتج: ${product.name}`;
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // مشاركة المنتج
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.targetAudiences || 'منتج ذكاء اصطناعي',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  // Modal
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          {children}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>{error || 'المنتج غير موجود'}</h2>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              <i className="fas fa-arrow-right"></i> العودة للمنتجات
            </button>
          </div>
        </div>
      </div>
    );
  }

  // تحويل FAQs
  const faqsArray = product.faqs && typeof product.faqs === 'object' 
    ? Object.entries(product.faqs).map(([question, answer]) => ({ question, answer }))
    : [];

  return (
    <div className="product-details-page">
      {/* Hero */}
      <section className="product-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              {/* Breadcrumb */}
              <div className="breadcrumb">
                <span onClick={() => navigate('/')} className="breadcrumb-link">
                  <i className="fas fa-home"></i> الرئيسية
                </span>
                <i className="fas fa-chevron-left"></i>
                <span onClick={() => navigate('/products')} className="breadcrumb-link">
                  المنتجات
                </span>
                <i className="fas fa-chevron-left"></i>
                <span className="breadcrumb-current">{product.name}</span>
              </div>

              <h1 className="product-title">{product.name}</h1>
              <p className="product-subtitle">{product.targetAudiences}</p>

              {/* Badges */}
              <div className="product-badges">
                {product.readinessStatus && (
                  <span className="badge badge-success">
                    <i className="fas fa-circle"></i>
                    {product.readinessStatus}
                  </span>
                )}
                {product.subCategory && (
                  <span className="badge badge-category">
                    <i className="fas fa-tag"></i>
                    {product.subCategory}
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="product-pricing">
                {product.discountPrice > 0 && product.discountPrice < product.customerPrice ? (
                  <>
                    <span className="price-original">{formatPrice(product.customerPrice)}</span>
                    <span className="price-discount">{formatPrice(product.discountPrice)}</span>
                    <span className="discount-badge">
                      وفر {Math.round(((product.customerPrice - product.discountPrice) / product.customerPrice) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="price-main">{formatPrice(product.customerPrice)}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn btn-primary btn-large" onClick={handleWhatsAppContact}>
                  <i className="fab fa-whatsapp"></i>
                  احصل عليه الآن
                </button>
                <button className="btn btn-secondary btn-large" onClick={() => setShowContactModal(true)}>
                  <i className="fas fa-file-invoice"></i>
                  اطلب عرض سعر
                </button>
                <button className="btn btn-outline btn-large" onClick={handleShare}>
                  <i className="fas fa-share-alt"></i>
                  مشاركة
                </button>
              </div>
            </div>

            <div className="hero-image">
              <div className="product-icon-large">
                <i className="fas fa-robot"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="product-tabs">
        <div className="container">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              <i className="fas fa-star"></i>
              المميزات
            </button>
            <button 
              className={`tab-btn ${activeTab === 'selling-points' ? 'active' : ''}`}
              onClick={() => setActiveTab('selling-points')}
            >
              <i className="fas fa-check-circle"></i>
              نقاط البيع
            </button>
            {product.competitors && product.competitors.length > 0 && (
              <button 
                className={`tab-btn ${activeTab === 'competitors' ? 'active' : ''}`}
                onClick={() => setActiveTab('competitors')}
              >
                <i className="fas fa-chart-line"></i>
                المنافسون
              </button>
            )}
            {faqsArray.length > 0 && (
              <button 
                className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
                onClick={() => setActiveTab('faqs')}
              >
                <i className="fas fa-question-circle"></i>
                الأسئلة الشائعة
              </button>
            )}
          </div>

          <div className="tabs-content">
            {/* Features */}
            {activeTab === 'features' && (
              <div className="tab-panel">
                {product.features && product.features.length > 0 ? (
                  <div className="features-grid">
                    {product.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-icon">
                          <i className="fas fa-check"></i>
                        </div>
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">لا توجد مميزات متاحة</p>
                )}
              </div>
            )}

            {/* Selling Points */}
            {activeTab === 'selling-points' && (
              <div className="tab-panel">
                {product.sellingPoints && product.sellingPoints.length > 0 ? (
                  <div className="selling-points-list">
                    {product.sellingPoints.map((point, index) => (
                      <div key={index} className="selling-point">
                        <div className="point-number">{index + 1}</div>
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">لا توجد نقاط بيع متاحة</p>
                )}
              </div>
            )}

            {/* Competitors */}
            {activeTab === 'competitors' && (
              <div className="tab-panel">
                {product.competitors && product.competitors.length > 0 ? (
                  <div className="competitors-grid">
                    {product.competitors.map((competitor, index) => (
                      <div key={index} className="competitor-card">
                        <h4>{competitor}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">لا توجد معلومات عن المنافسين</p>
                )}
              </div>
            )}

            {/* FAQs */}
            {activeTab === 'faqs' && (
              <div className="tab-panel">
                {faqsArray.length > 0 ? (
                  <div className="faqs-container">
                    {faqsArray.map((faq, index) => (
                      <div 
                        key={index} 
                        className={`faq-item ${activeFAQ === index ? 'active' : ''}`}
                      >
                        <div 
                          className="faq-question"
                          onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                        >
                          <span>{faq.question}</span>
                          <i className={`fas fa-chevron-${activeFAQ === index ? 'up' : 'down'}`}></i>
                        </div>
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">لا توجد أسئلة شائعة</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="container">
            <h2 className="section-title">منتجات ذات صلة</h2>
            <div className="related-products-grid">
              {relatedProducts.map(related => (
                <div 
                  key={related.id} 
                  className="product-card"
                  onClick={() => navigate(`/product/${related.id}`)}
                >
                  <h3>{related.name}</h3>
                  <p>{related.targetAudiences}</p>
                  <button className="btn btn-outline">
                    <i className="fas fa-arrow-left"></i>
                    اعرف المزيد
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)}>
        <div className="contact-modal-content">
          <h2>طلب عرض سعر</h2>
          <p>
            للحصول على عرض سعر مخصص لـ <strong>{product.name}</strong>، 
            يرجى التواصل معنا عبر واتساب.
          </p>
          <button className="btn btn-success btn-fullwidth" onClick={handleWhatsAppContact}>
            <i className="fab fa-whatsapp"></i>
            التواصل عبر واتساب
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;