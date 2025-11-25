// src/components/News.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/news.css';

// ✅ Define once at module level — accessible everywhere
const CATEGORY_MAP = {
  all: 'جميع الأخبار',
  tech: 'تقنية',
  tips: 'نصائح',
  market: 'أعمال',
  research: 'أبحاث',
  events: 'فعاليات',
  education: 'تعليم',
  health: 'صحة'
};

const News = () => {
  // UI State
  const [activeCategory, setActiveCategory] = useState('all');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data State
  const [allNews, setAllNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Fetch full list once (100 items max)
  const fetchAllNews = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/news?limit=100');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل جلب الأخبار');
      return data.news || [];
    } catch (err) {
      console.error('❌ fetchAllNews:', err);
      throw err;
    }
  }, []);

  // 🔄 Apply filters + search
  const applyFilters = useCallback(() => {
    let filtered = allNews;

    // Category filter
    if (activeCategory !== 'all') {
      const targetCat = CATEGORY_MAP[activeCategory] || activeCategory;
      filtered = filtered.filter(n => n.category === targetCat);
    }

    // Search (title + summary)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n =>
        (n.title?.toLowerCase().includes(term)) ||
        (n.summary?.toLowerCase().includes(term))
      );
    }

    // ✅ Show featured ONLY when: category="all" AND no search
    const shouldShowFeatured = activeCategory === 'all' && !searchTerm;
    const latest = filtered.length > 0 ? filtered[0] : null;
    setFeaturedNews(shouldShowFeatured ? latest : null);

    // Grid: skip featured only if showing it
    const grid = shouldShowFeatured ? filtered.slice(1) : filtered;
    setDisplayedNews(grid);
    setLoading(false);
  }, [activeCategory, searchTerm, allNews]);

  // 🎯 Initial load
  useEffect(() => {
    const loadData = async () => {
      if (allNews.length === 0) {
        try {
          const news = await fetchAllNews();
          setAllNews(news);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        applyFilters();
      }
    };
    loadData();
  }, [activeCategory, searchTerm, allNews, applyFilters, fetchAllNews]);

  // 🕒 Auto-refresh every 30 min
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllNews().then(setAllNews);
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllNews]);

  // ✅ AOS init
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({ duration: 800, once: true, offset: 100 });
    }
  }, []);

  // Handlers
  const toggleInfo = () => setShowInfoPanel(!showInfoPanel);
  const filterNews = (category) => setActiveCategory(category);
  const loadMore = () => alert('سيتم تحميل المزيد — قيد التطوير');

  /*
  const subscribeNewsletter = (e) => {
    e.preventDefault();
    alert('✅ تم الاشتراك! سنرسل أحدث أخبار الذكاء الاصطناعي قريباً.');
    e.target.reset();
  };
  */

  //=========== N8N NewsLetter ===========
  const subscribeNewsletter = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('⚠️ يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
  
    try {
      const res = await fetch('https://undelusively-cordate-alysia.ngrok-free.dev/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      const data = await res.json();
      if (data.success) {
        alert('✅ تم الاشتراك بنجاح! ستصلك رسالة ترحيب قريباً.');
        e.target.reset();
      } else {
        throw new Error(data.error || 'فشل الاشتراك');
      }
    } catch (err) {
      console.error('❌ Subscribe error:', err);
      alert(`فشل الاشتراك: ${err.message}`);
    }
  };

  const shareArticle = (platform, articleId, title = 'خبر من وقت الذكاء') => {
    const url = `${window.location.origin}/article?id=${article.id}`;
    let shareUrl = '';
    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`; break;
      case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
      default: return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // 🔹 Helpers
  const getCategoryIcon = (category) => {
    const map = {
      'تقنية': 'fas fa-microchip',
      'نصائح': 'fas fa-lightbulb',
      'أعمال': 'fas fa-chart-line',
      'أبحاث': 'fas fa-flask',
      'فعاليات': 'fas fa-users',
      'تعليم': 'fas fa-graduation-cap',
      'صحة': 'fas fa-hospital'
    };
    return <i className={map[category] || 'fas fa-newspaper'}></i>;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'غير معروف';
  
    let date;
  
    // 🔹 1. Firebase Timestamp (serialized object: _seconds, _nanoseconds)
    if (timestamp._seconds !== undefined) {
      date = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
    }
    // 🔹 2. Firestore Timestamp instance (seconds, nanoseconds)
    else if (timestamp.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
    }
    // 🔹 3. ISO string (e.g., "2025-11-18T16:03:18Z")
    else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
      if (isNaN(date)) {
        // Try YYYY-MM-DD format
        const match = timestamp.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
          date = new Date(Date.UTC(match[1], match[2] - 1, match[3]));
        }
      }
    }
    // 🔹 4. Unix timestamp (ms)
    else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    }
    // ❌ Invalid
    else {
      console.warn('⚠️ Unknown timestamp format:', timestamp);
      return 'غير معروف';
    }
  
    // Validate
    if (!date || isNaN(date.getTime())) {
      console.warn('⚠️ Invalid date from:', timestamp);
      return 'غير معروف';
    }
  
    // --- Relative time logic ---
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays === 0 && diffHours < 1) return 'الآن';
    if (diffDays === 0) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
  
    // --- Full Arabic date ---
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // ✅ Render
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
            {[
              { key: 'all', label: 'جميع الأخبار' },
              { key: 'tech', label: 'تقنية' },
              { key: 'tips', label: 'نصائح' },
              { key: 'market', label: 'أعمال' },
              { key: 'research', label: 'أبحاث' },
              { key: 'events', label: 'فعاليات' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${activeCategory === tab.key ? 'active' : ''}`}
                onClick={() => filterNews(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="ابحث في عناوين أو ملخصات أخبار الذكاء الاصطناعي..."
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
          {/* ✅ Featured: only if NOT filtering/searching */}
          {featuredNews && (
            <div className="featured-article" data-aos="fade-up">
              <div className="featured-content">
                <div className="featured-image">
                  {getCategoryIcon(featuredNews.category)}
                </div>
                <div className="featured-text">
                  <span className="featured-badge">خبر مميز</span>
                  <h2 className="featured-title">{featuredNews.title}</h2>
                  <p className="featured-excerpt">{featuredNews.summary}</p>
                  <div className="article-footer">
                    <a href={`/article?id=${featuredNews.id}`} className="read-more">
                      اقرأ المزيد <i className="fas fa-arrow-left"></i>
                    </a>
                    <div className="share-buttons">
                      <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', featuredNews.id, featuredNews.title)}>
                        <i className="fab fa-facebook-f"></i>
                      </div>
                      <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', featuredNews.id, featuredNews.title)}>
                        <i className="fab fa-twitter"></i>
                      </div>
                      <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', featuredNews.id, featuredNews.title)}>
                        <i className="fab fa-whatsapp"></i>
                      </div>
                      <div className="share-btn share-linkedin" onClick={() => shareArticle('linkedin', featuredNews.id, featuredNews.title)}>
                        <i className="fab fa-linkedin-in"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Optional header for filtered/search results */}
          {!featuredNews && displayedNews.length > 0 && (
            <div style={{
              textAlign: 'center',
              margin: '1.5rem 0 1rem',
              color: 'var(--text-muted)',
              fontSize: '1rem'
            }}>
              {searchTerm ? (
                <>نتائج البحث عن "<strong>{searchTerm}</strong>"</>
              ) : (
                <>أخبار فئة "<strong>{CATEGORY_MAP[activeCategory] || activeCategory}</strong>"</>
              )}
            </div>
          )}

          {/* News Grid */}
          <div className="news-grid">
            {loading ? (
              <div className="loading-message" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>جاري تحميل أخبار الذكاء الاصطناعي...</p>
              </div>
            ) : error ? (
              <div className="error-message" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--danger-color)' }}>
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
                  إعادة المحاولة
                </button>
              </div>
            ) : displayedNews.length === 0 ? (
              <div className="no-news-message" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <i className="fas fa-robot" style={{ fontSize: '3rem', color: 'var(--gray-400)' }}></i>
                <h3 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>لا توجد أخبار</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  {searchTerm
                    ? `لا توجد أخبار عن "${searchTerm}" في عالم الذكاء الاصطناعي`
                    : activeCategory === 'all'
                    ? 'لا توجد أخبار حالياً'
                    : `لا توجد أخبار في فئة "${CATEGORY_MAP[activeCategory] || activeCategory}"`}
                </p>
              </div>
            ) : (
              displayedNews.map((article, index) => (
                <article
                  key={article.id || index}
                  className="news-article"
                  data-aos="fade-up"
                  data-aos-delay={`${(index + 1) * 100}`}
                >
                  <div className="article-image">
                    {getCategoryIcon(article.category)}
                    <span className="article-category">{article.category}</span>
                  </div>
                  <div className="article-content">
                    <div className="article-date">
                      <i className="far fa-calendar"></i> {formatDate(article.createdAt)}
                    </div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.summary}</p>
                    <div className="article-footer">
                      <a href={`/article?id=${article.id}`} className="read-more">
                        اقرأ المزيد <i className="fas fa-arrow-left"></i>
                      </a>
                      <div className="share-buttons">
                        <div className="share-btn share-facebook" onClick={() => shareArticle('facebook', article.id, article.title)}>
                          <i className="fab fa-facebook-f"></i>
                        </div>
                        <div className="share-btn share-twitter" onClick={() => shareArticle('twitter', article.id, article.title)}>
                          <i className="fab fa-twitter"></i>
                        </div>
                        <div className="share-btn share-whatsapp" onClick={() => shareArticle('whatsapp', article.id, article.title)}>
                          <i className="fab fa-whatsapp"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {displayedNews.length > 0 && (
            <div className="load-more">
              <button className="btn btn-primary" onClick={loadMore}>
                <i className="fas fa-plus"></i> تحميل المزيد من أخبار الذكاء الاصطناعي
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content" data-aos="fade-up">
            <h2 className="newsletter-title">اشترك في نشرتنا الإخبارية</h2>
            <p>احصل على آخر أخبار **الذكاء الاصطناعي** مباشرة في بريدك</p>
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
    </div>
  );
};

export default News;