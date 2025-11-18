// FAQ.jsx
// صفحة الأسئلة الشائعة - محولة من HTML إلى React Component بالكامل
// جميع المحتويات والتفاصيل من الملف الأصلي

import React, { useState, useEffect } from 'react';
import '../styles/faq.css';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [openQuestions, setOpenQuestions] = useState(new Set());

  // Initialize AOS animation on component mount
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }
  }, []);

  // Toggle Info Panel
  const toggleInfo = () => {
    setShowInfoPanel(!showInfoPanel);
  };

  // Filter FAQ by Category
  const filterFAQ = (category) => {
    setActiveCategory(category);
    // Add filter logic here
    console.log('Filtering by:', category);
  };

  // Toggle FAQ Question
  const toggleFAQ = (questionIndex) => {
    setOpenQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  // Share Page on Social Media
  const sharePage = (platform) => {
    const url = window.location.href;
    const title = 'الأسئلة الشائعة - منصة وقت الذكاء';
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Subscribe to Newsletter
  const subscribeNewsletter = (event) => {
    event.preventDefault();
    alert('شكراً لاشتراكك! سنرسل لك آخر الأخبار على بريدك الإلكتروني.');
    event.target.reset();
  };

  // FAQ Data Structure
  const faqData = {
    general: {
      title: 'أسئلة عامة',
      icon: 'fa-info-circle',
      questions: [
        {
          q: 'ما هي منصة وقت الذكاء؟',
          a: {
            text: 'منصة وقت الذكاء هي منصة رائدة في مجال الذكاء الاصطناعي مخصصة للسوق العربي، نقدم حلولاً مبتكرة وبسيطة تساعد الأفراد والشركات على الاستفادة من قوة الذكاء الاصطناعي في أعمالهم اليومية.',
            list: [
              'حلول مخصصة للسوق العربي',
              'دعم كامل باللغة العربية',
              'أسعار منافسة بالريال السعودي',
              'خبرة تزيد عن 7 شهور في التطوير'
            ]
          }
        },
        {
          q: 'لمن تستهدف منصة وقت الذكاء؟',
          a: {
            text: 'منصتنا تستهدف جميع الفئات:',
            list: [
              'المبتدئين الذين لا يملكون خبرة في الذكاء الاصطناعي',
              'أصحاب الأعمال الصغيرة والمتوسطة',
              'المؤسسات الكبرى',
              'الأفراد الراغبين في تطوير مهاراتهم',
              'المطورين والمبرمجين'
            ]
          }
        },
        {
          q: 'ما الذي يميز منصة وقت الذكاء عن المنافسين؟',
          a: {
            text: 'نتميز بعدة جوانب مهمة:',
            list: [
              'التركيز على البساطة وسهولة الاستخدام',
              'حلول عملية وليست نظرية',
              'دعم كامل باللغة العربية',
              'أسعار تنافسية مناسبة للسوق المحلي',
              'تطوير سريع باستخدام Vibe Code',
              'خدمة عملاء متميزة'
            ]
          }
        }
      ]
    },
    products: {
      title: 'أسئلة حول المنتجات',
      icon: 'fa-box',
      questions: [
        {
          q: 'ما هي المنتجات المتاحة حالياً؟',
          a: {
            text: 'لدينا مجموعة متنوعة من المنتجات الجاهزة:',
            list: [
              'بطاقات الإتقان الذكية',
              'نظام الذكاء المؤسسي',
              'ذكاء الأسر المنتجة',
              'منصة صفحات الهبوط',
              'برامج Vibe Code للأتمتة',
              'الذكاءات المخصصة'
            ]
          }
        },
        {
          q: 'ما هو Vibe Code؟',
          a: {
            text: 'Vibe Code هو نظامنا المبتكر للأتمتة والبرمجة السريعة باستخدام الذكاء الاصطناعي. يمكننا من خلاله:',
            list: [
              'تطوير برامج مخصصة في 3-5 أيام',
              'أتمتة العمليات الروتينية',
              'إنشاء حلول برمجية بدون خبرة برمجية',
              'توفير 80% من وقت التطوير التقليدي'
            ]
          }
        },
        {
          q: 'هل يمكن تخصيص المنتجات حسب احتياجاتي؟',
          a: {
            text: 'نعم بالتأكيد! جميع منتجاتنا قابلة للتخصيص الكامل:',
            list: [
              'تخصيص الواجهات والتصميم',
              'إضافة ميزات خاصة',
              'التكامل مع أنظمتك الحالية',
              'دعم لغات متعددة',
              'تخصيص التقارير والتحليلات'
            ]
          }
        }
      ]
    },
    pricing: {
      title: 'أسئلة حول الأسعار',
      icon: 'fa-dollar-sign',
      questions: [
        {
          q: 'كيف يتم تسعير المنتجات؟',
          a: {
            text: 'نعتمد نظام تسعير مرن يناسب جميع الفئات:',
            list: [
              'اشتراكات شهرية للخدمات المستمرة',
              'دفعة واحدة للبرامج المخصصة',
              'باقات متدرجة حسب الاستخدام',
              'خصومات للعقود السنوية',
              'عروض خاصة للشركات الناشئة'
            ]
          }
        },
        {
          q: 'هل توجد فترة تجريبية مجانية؟',
          a: {
            text: 'نعم، نوفر فترات تجريبية لمعظم منتجاتنا:',
            list: [
              '7 أيام تجربة مجانية للمنتجات الأساسية',
              '14 يوم للمنتجات المؤسسية',
              'عروض توضيحية مجانية',
              'ضمان استرجاع الأموال لمدة 30 يوم'
            ]
          }
        },
        {
          q: 'ما هي طرق الدفع المتاحة؟',
          a: {
            text: 'نوفر طرق دفع متنوعة لراحتك:',
            list: [
              'البطاقات الائتمانية (Visa, MasterCard)',
              'التحويل البنكي المباشر',
              'Apple Pay و Google Pay',
              'PayPal',
              'الدفع عند التسليم للبرامج المخصصة'
            ]
          }
        }
      ]
    },
    technical: {
      title: 'أسئلة تقنية',
      icon: 'fa-cog',
      questions: [
        {
          q: 'هل أحتاج خبرة تقنية لاستخدام المنصة؟',
          a: {
            text: 'لا، منصتنا مصممة للجميع:',
            list: [
              'واجهات بسيطة وسهلة الاستخدام',
              'شروحات وفيديوهات تعليمية',
              'دعم فني متواصل',
              'لا حاجة لخبرة برمجية'
            ]
          }
        },
        {
          q: 'كيف يتم حماية بياناتي؟',
          a: {
            text: 'نطبق أعلى معايير الأمان:',
            list: [
              'تشفير SSL متقدم',
              'خوادم آمنة ومحمية',
              'نسخ احتياطي يومي',
              'سياسة خصوصية صارمة',
              'امتثال كامل لقوانين حماية البيانات'
            ]
          }
        },
        {
          q: 'هل يمكن التكامل مع الأنظمة الحالية؟',
          a: {
            text: 'نعم، نوفر تكاملاً سلساً مع معظم الأنظمة:',
            list: [
              'APIs مفتوحة وموثقة',
              'تكامل مع أنظمة ERP',
              'ربط مع منصات السوشيال ميديا',
              'تكامل مع أدوات Microsoft و Google'
            ]
          }
        }
      ]
    },
    support: {
      title: 'أسئلة حول الدعم',
      icon: 'fa-headset',
      questions: [
        {
          q: 'كيف يمكنني الحصول على الدعم الفني؟',
          a: {
            text: 'نوفر قنوات دعم متعددة:',
            list: [
              'دردشة مباشرة على الموقع',
              'WhatsApp للدعم السريع',
              'بريد إلكتروني support@ai-time.com',
              'مركز اتصال مخصص',
              'قاعدة معرفية شاملة'
            ]
          }
        },
        {
          q: 'ما هي ساعات الدعم الفني؟',
          a: {
            text: 'الدعم متاح حسب نوع الباقة:',
            list: [
              'الباقة الأساسية: 9 صباحاً - 5 مساءً',
              'الباقة المتقدمة: 8 صباحاً - 10 مساءً',
              'الباقة المؤسسية: 24/7',
              'دعم طوارئ للجميع'
            ]
          }
        },
        {
          q: 'هل تقدمون تدريباً على استخدام المنتجات؟',
          a: {
            text: 'نعم، نقدم برامج تدريبية شاملة:',
            list: [
              'جلسات تدريبية مباشرة',
              'فيديوهات تعليمية',
              'دليل استخدام مفصل',
              'ورش عمل دورية',
              'شهادات إتمام التدريب'
            ]
          }
        }
      ]
    }
  };

  // Get visible categories
  const getVisibleCategories = () => {
    if (activeCategory === 'all') {
      return Object.keys(faqData);
    }
    return [activeCategory];
  };

  return (
    <div className="faq-page">
      

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div data-aos="fade-up">
            <h1 className="page-title">
              <i className="fas fa-question-circle"></i>
              الأسئلة الشائعة
            </h1>
            <p className="page-subtitle">إجابات شاملة لأكثر الأسئلة شيوعاً حول منصة وقت الذكاء</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid" data-aos="fade-up">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => filterFAQ('all')}
            >
              <i className="fas fa-list"></i> جميع الأسئلة
            </button>
            <button 
              className={`category-btn ${activeCategory === 'general' ? 'active' : ''}`}
              onClick={() => filterFAQ('general')}
            >
              <i className="fas fa-info-circle"></i> عامة
            </button>
            <button 
              className={`category-btn ${activeCategory === 'products' ? 'active' : ''}`}
              onClick={() => filterFAQ('products')}
            >
              <i className="fas fa-box"></i> المنتجات
            </button>
            <button 
              className={`category-btn ${activeCategory === 'pricing' ? 'active' : ''}`}
              onClick={() => filterFAQ('pricing')}
            >
              <i className="fas fa-dollar-sign"></i> الأسعار
            </button>
            <button 
              className={`category-btn ${activeCategory === 'technical' ? 'active' : ''}`}
              onClick={() => filterFAQ('technical')}
            >
              <i className="fas fa-cog"></i> تقنية
            </button>
            <button 
              className={`category-btn ${activeCategory === 'support' ? 'active' : ''}`}
              onClick={() => filterFAQ('support')}
            >
              <i className="fas fa-headset"></i> الدعم
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-container">
            {getVisibleCategories().map((category) => {
              const categoryData = faqData[category];
              return (
                <div key={category} className="faq-group" data-category={category}>
                  <h2 className="faq-group-title" data-aos="fade-up">
                    <i className={`fas ${categoryData.icon}`}></i> {categoryData.title}
                  </h2>
                  
                  {categoryData.questions.map((faq, index) => {
                    const questionId = `${category}-${index}`;
                    const isOpen = openQuestions.has(questionId);
                    
                    return (
                      <div 
                        key={questionId}
                        className="faq-item" 
                        data-aos="fade-up" 
                        data-aos-delay={((index % 3) + 1) * 100}
                      >
                        <div 
                          className={`faq-question ${isOpen ? 'active' : ''}`}
                          onClick={() => toggleFAQ(questionId)}
                        >
                          <span>{faq.q}</span>
                          <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                          <p>{faq.a.text}</p>
                          {faq.a.list && (
                            <ul>
                              {faq.a.list.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Share Section */}
          <div className="share-section" data-aos="fade-up">
            <h3 className="share-title">وجدت هذه الصفحة مفيدة؟ شاركها مع أصدقائك!</h3>
            <div className="share-buttons">
              <a href="#" className="share-btn share-facebook" onClick={(e) => { e.preventDefault(); sharePage('facebook'); }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="share-btn share-twitter" onClick={(e) => { e.preventDefault(); sharePage('twitter'); }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="share-btn share-whatsapp" onClick={(e) => { e.preventDefault(); sharePage('whatsapp'); }}>
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" className="share-btn share-linkedin" onClick={(e) => { e.preventDefault(); sharePage('linkedin'); }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="share-btn share-telegram" onClick={(e) => { e.preventDefault(); sharePage('telegram'); }}>
                <i className="fab fa-telegram-plane"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="quick-links" data-aos="fade-up">
            <h3 className="quick-links-title">روابط سريعة</h3>
            <div className="links-grid">
              <a href="contact.html" className="quick-link">
                <i className="fas fa-phone"></i> تواصل معنا
              </a>
              <a href="products.html" className="quick-link">
                <i className="fas fa-box"></i> استكشف منتجاتنا
              </a>
              <a href="request-program.html" className="quick-link">
                <i className="fas fa-code"></i> اطلب برنامجك
              </a>
              <a href="videos.html" className="quick-link">
                <i className="fas fa-video"></i> شاهد الفيديوهات
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content" data-aos="fade-up">
            <h2 className="newsletter-title">ابق على اطلاع</h2>
            <p>اشترك في نشرتنا البريدية لتصلك آخر الأخبار والتحديثات</p>
            <form className="newsletter-form" onSubmit={subscribeNewsletter}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="بريدك الإلكتروني"
                required
              />
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> اشترك
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;