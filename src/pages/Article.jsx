// src/pages/Article.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/news.css';

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  // ✅ Robust date formatter (handles _seconds/_nanoseconds)
  const formatDate = (timestamp) => {
    if (!timestamp) return 'غير معروف';

    let date;
    // Firestore serialized timestamp: { _seconds, _nanoseconds }
    if (timestamp._seconds !== undefined) {
      date = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1e6);
    }
    // Standard Timestamp: { seconds, nanoseconds }
    else if (timestamp.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1e6);
    }
    // ISO string or Date
    else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Invalid
    else {
      return 'غير معروف';
    }

    if (isNaN(date.getTime())) return 'غير معروف';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError('معرف الخبر مطلوب');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'الخبر غير موجود');
        }
        const data = await res.json();
        if (!data.success || !data.news) {
          throw new Error('الخبر غير موجود');
        }
        setArticle(data.news);
      } catch (err) {
        console.error('❌ فشل جلب الخبر:', err);
        setError(err.message || 'فشل تحميل الخبر');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>جاري تحميل الخبر...</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--danger-color)' }}>
      <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
      <h3 style={{ marginTop: '1rem' }}>عُذرًا</h3>
      <p>{error}</p>
      <a href="/news" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
        العودة لقائمة الأخبار
      </a>
    </div>
  );

  if (!article) return null;

  // ✅ Fallback: if no `content`, use extended summary
  const fullContent = article.content || 
    `${article.summary}\n\n` +
    `هذا الخبر تم توليده تلقائياً بواسطة نموذج الذكاء الاصطناعي Llama 3، ويغطي أحدث التطورات في مجال "${article.category}".`;

  return (
    <div className="news-page">
      <section className="page-hero" style={{ 
        background: 'linear-gradient(135deg, var(--gray-100), var(--white))',
        padding: '3rem 0'
      }}>
        <div className="container">
          <div data-aos="fade-up">
            <span className="article-category-badge" style={{
              display: 'inline-block',
              padding: '0.3rem 1rem',
              background: 'var(--primary-lightest)',
              color: 'var(--primary-color)',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              {article.category}
            </span>
            <h1 className="page-title" style={{ 
              marginTop: 0, 
              fontSize: '2.2rem',
              lineHeight: 1.3,
              color: 'var(--text-primary)'
            }}>
              {article.title}
            </h1>
            <p className="page-subtitle" style={{ 
              marginTop: '0.5rem', 
              color: 'var(--text-muted)',
              fontSize: '1.1rem'
            }}>
              <i className="far fa-calendar"></i> {formatDate(article.createdAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="news-section">
        <div className="container">
          <article className="article-full" style={{ 
            maxWidth: '750px', 
            margin: '0 auto',
            background: 'var(--white)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Summary Box */}
            <div style={{ 
              background: 'var(--primary-lightest)', 
              borderLeft: '4px solid var(--primary-color)',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '1rem',
                fontSize: '1.4rem'
              }}>الملخص</h2>
              <p style={{ 
                lineHeight: 1.8, 
                fontSize: '1.1rem',
                color: 'var(--text-secondary)'
              }}>
                {article.summary}
              </p>
            </div>

            {/* Full Content */}
            <div className="article-body" style={{ 
              lineHeight: 1.8,
              fontSize: '1.05rem',
              color: 'var(--text-primary)'
            }}>
              <p>{fullContent}</p>
            </div>

            {/* Footer: Back + Share */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <a href="/news" className="btn btn-outline" style={{ 
                padding: '0.6rem 1.5rem'
              }}>
                ← العودة لقائمة الأخبار
              </a>
              <div className="share-buttons">
                <div 
                  className="share-btn share-facebook"
                  onClick={() => share('facebook')}
                  title="مشاركة على فيسبوك"
                >
                  <i className="fab fa-facebook-f"></i>
                </div>
                <div 
                  className="share-btn share-twitter"
                  onClick={() => share('twitter')}
                  title="مشاركة على تويتر"
                >
                  <i className="fab fa-twitter"></i>
                </div>
                <div 
                  className="share-btn share-whatsapp"
                  onClick={() => share('whatsapp')}
                  title="مشاركة على واتساب"
                >
                  <i className="fab fa-whatsapp"></i>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );

  function share(platform) {
    const url = `${window.location.origin}/article?id=${id}`;
    const title = article.title;
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

export default Article;