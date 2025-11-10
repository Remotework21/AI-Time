// News.jsx
// صفحة الأخبار - محولة من HTML إلى React Component بالكامل
// جميع المحتويات والتفاصيل من الملف الأصلي

import React, { useState, useEffect } from 'react';
import '../styles/news.css';

const News = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize AOS animation on component mount
  useEffect(() => {
    // Initialize AOS if library is available
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

  // Filter News by Category
  const filterNews = (category) => {
    setActiveCategory(category);
    console.log('Filtering by:', category);
    // Add filter logic here with API
  };

  // Share Article on Social Media
  const shareArticle = (platform, articleId) => {
    const url = window.location.origin + '/article.html?id=' + articleId;
    const title = 'اقرأ هذا الخبر المميز من منصة وقت الذكاء';
    
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
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Load More Articles
  const loadMore = () => {
    alert('سيتم تحميل المزيد من الأخبار...');
    // Add pagination logic here with API
  };

  // Subscribe to Newsletter
  const subscribeNewsletter = (event) => {
    event.preventDefault();
    alert('شكراً لاشتراكك! سنرسل لك آخر الأخبار على بريدك الإلكتروني.');
    event.target.reset();
  };

  return (
    <div className="news-page">
      

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div data-aos="fade-up">
            <h1 className="page-title">أخبار الذكاء</h1>
            <p className="page-subtitle">آخر التطورات والمستجدات في عالم الذكاء الاصطناعي</p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <div className="container">
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => filterNews('all')}
            >
              جميع الأخبار
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'tech' ? 'active' : ''}`}
              onClick={() => filterNews('tech')}
            >
              تقنية
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'tips' ? 'active' : ''}`}
              onClick={() => filterNews('tips')}
            >
              نصائح
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'market' ? 'active' : ''}`}
              onClick={() => filterNews('market')}
            >
              السوق
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'research' ? 'active' : ''}`}
              onClick={() => filterNews('research')}
            >
              أبحاث
            </button>
            <button 
              className={`tab-btn ${activeCategory === 'events' ? 'active' : ''}`}
              onClick={() => filterNews('events')}
            >
              فعاليات
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="ابحث في الأخبار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="container">
          {/* Featured Article */}
          <div className="featured-article" data-aos="fade-up">
            <div className="featured-content">
              <div className="featured-image">
                <i className="fas fa-robot"></i>
              </div>
              <div className="featured-text">
                <span className="featured-badge">خبر مميز</span>
                <h2 className="featured-title">OpenAI تطلق GPT-5 بقدرات غير مسبوقة في فهم السياق</h2>
                <p className="featured-excerpt">
                  في تطور مذهل، أعلنت شركة OpenAI عن إطلاق الجيل الخامس من نموذج GPT بقدرات تفوق كل التوقعات، 
                  حيث يمكنه الآن فهم السياق بشكل أعمق والقيام بمهام معقدة كانت تعتبر مستحيلة سابقاً...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=1" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '1')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '1')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '1')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                    <div className="share-btn share-linkedin" onClick={() => shareArticle('linkedin', '1')}>
                      <i className="fab fa-linkedin-in"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Grid */}
          <div className="news-grid">
            {/* Article 1 */}
            <article className="news-article" data-aos="fade-up" data-aos-delay="100">
              <div className="article-image">
                <i className="fas fa-chart-line"></i>
                <span className="article-category">السوق</span>
              </div>
              <div className="article-content">
                <div className="article-date">
                  <i className="far fa-calendar"></i> منذ يومين
                </div>
                <h3 className="article-title">السعودية تستثمر 100 مليار ريال في مشاريع الذكاء الاصطناعي</h3>
                <p className="article-excerpt">
                  أعلنت المملكة العربية السعودية عن خطة استثمارية ضخمة لتطوير قطاع الذكاء الاصطناعي، 
                  تشمل إنشاء مراكز بحثية متقدمة وبرامج تدريبية متخصصة...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=2" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '2')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '2')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '2')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 2 */}
            <article className="news-article" data-aos="fade-up" data-aos-delay="200">
              <div className="article-image">
                <i className="fas fa-lightbulb"></i>
                <span className="article-category">نصائح</span>
              </div>
              <div className="article-content">
                <div className="article-date">
                  <i className="far fa-calendar"></i> منذ 3 أيام
                </div>
                <h3 className="article-title">10 تقنيات متقدمة لكتابة البرومبت الاحترافي</h3>
                <p className="article-excerpt">
                  اكتشف الأساليب الاحترافية للحصول على أفضل النتائج من نماذج الذكاء الاصطناعي، 
                  من خلال تقنيات البرومبت المتقدمة التي يستخدمها الخبراء...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=3" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '3')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '3')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '3')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 3 */}
            <article className="news-article" data-aos="fade-up" data-aos-delay="300">
              <div className="article-image">
                <i className="fas fa-microchip"></i>
                <span className="article-category">تقنية</span>
              </div>
              <div className="article-content">
                <div className="article-date">
                  <i className="far fa-calendar"></i> منذ 4 أيام
                </div>
                <h3 className="article-title">Apple تكشف عن معالج AI جديد بقوة خارقة</h3>
                <p className="article-excerpt">
                  كشفت شركة Apple عن معالج جديد مخصص للذكاء الاصطناعي يوفر قوة معالجة تفوق المنافسين 
                  بـ 10 أضعاف، مع استهلاك طاقة أقل بنسبة 50%...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=4" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '4')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '4')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '4')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 4 */}
            <article className="news-article" data-aos="fade-up" data-aos-delay="400">
              <div className="article-image">
                <i className="fas fa-graduation-cap"></i>
                <span className="article-category">تعليم</span>
              </div>
              <div className="article-content">
                <div className="article-date">
                  <i className="far fa-calendar"></i> منذ أسبوع
                </div>
                <h3 className="article-title">Google تطلق دورات مجانية في الذكاء الاصطناعي بالعربية</h3>
                <p className="article-excerpt">
                  أعلنت Google عن إطلاق سلسلة من الدورات التدريبية المجانية في مجال الذكاء الاصطناعي 
                  باللغة العربية، تستهدف المبتدئين والمحترفين على حد سواء...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=5" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '5')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '5')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '5')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 5 */}
            <article className="news-article" data-aos="fade-up" data-aos-delay="500">
              <div className="article-image">
                <i className="fas fa-users"></i>
                <span className="article-category">فعاليات</span>
              </div>
              <div className="article-content">
                <div className="article-date">
                  <i className="far fa-calendar"></i> منذ أسبوع
                </div>
                <h3 className="article-title">مؤتمر الذكاء الاصطناعي العربي 2025 ينطلق الشهر القادم</h3>
                <p className="article-excerpt">
                  أكبر تجمع للخبراء والمهتمين بالذكاء الاصطناعي في المنطقة العربية، 
                  يضم أكثر من 100 متحدث دولي و50 ورشة عمل متخصصة...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=6" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '6')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '6')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '6')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 6 */}
            <article className="news-article" data-aos="fade-up" data-aos-delay="600">
              <div className="article-image">
                <i className="fas fa-hospital"></i>
                <span className="article-category">صحة</span>
              </div>
              <div className="article-content">
                <div className="article-date">
                  <i className="far fa-calendar"></i> منذ أسبوعين
                </div>
                <h3 className="article-title">الذكاء الاصطناعي يكتشف علاجاً جديداً لمرض نادر</h3>
                <p className="article-excerpt">
                  نجح فريق من الباحثين في استخدام الذكاء الاصطناعي لاكتشاف علاج فعال لمرض نادر 
                  في وقت قياسي لم يتجاوز 6 أشهر بدلاً من 10 سنوات...
                </p>
                <div className="article-footer">
                  <a href="article.html?id=7" className="read-more">
                    اقرأ المزيد <i className="fas fa-arrow-left"></i>
                  </a>
                  <div className="share-buttons">
                    <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', '7')}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', '7')}>
                      <i className="fab fa-twitter"></i>
                    </div>
                    <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', '7')}>
                      <i className="fab fa-whatsapp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Load More */}
          <div className="load-more">
            <button className="btn btn-primary" onClick={loadMore}>
              <i className="fas fa-plus"></i> تحميل المزيد من الأخبار
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content" data-aos="fade-up">
            <h2 className="newsletter-title">اشترك في نشرتنا الإخبارية</h2>
            <p>احصل على آخر أخبار الذكاء الاصطناعي مباشرة في بريدك الإلكتروني</p>
            <form className="newsletter-form" onSubmit={subscribeNewsletter}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="بريدك الإلكتروني"
                required
              />
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </section>

    

      {/* Info Button */}
      <div className="info-button" onClick={toggleInfo}>
        <i className="fas fa-info"></i>
      </div>

      {/* Info Panel */}
      <div className={`info-panel ${showInfoPanel ? 'active' : ''}`} id="infoPanel">
        <span
          onClick={toggleInfo}
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </span>
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
          📋 معلومات صفحة الأخبار
        </h3>
        
        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🎯 الهدف من الصفحة:</h4>
        <p>عرض آخر أخبار ومستجدات الذكاء الاصطناعي مع إمكانية المشاركة على السوشيال ميديا</p>
        
        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>✨ المميزات:</h4>
        <ul style={{ listStyle: 'none', paddingRight: '1rem' }}>
          <li>• فلترة الأخبار حسب الفئة</li>
          <li>• البحث في الأخبار</li>
          <li>• مشاركة على السوشيال ميديا</li>
          <li>• تحميل المزيد (Pagination)</li>
          <li>• نشرة بريدية</li>
        </ul>
        
        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🔧 للمطور البرمجي:</h4>
        <ul style={{ listStyle: 'none', paddingRight: '1rem' }}>
          <li>• ربط مع API للأخبار</li>
          <li>• تنفيذ البحث والفلترة</li>
          <li>• Share API للمشاركة</li>
          <li>• Lazy loading للصور</li>
          <li>• Newsletter integration</li>
          <li>• RSS Feed</li>
        </ul>
      </div>
    </div>
  );
};

export default News;