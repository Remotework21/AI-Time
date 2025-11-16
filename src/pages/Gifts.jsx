// Gifts.jsx
// صفحة عرض جميع الهدايا
// API: https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiGifts

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Gifts.css';

const Gifts = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // API: جلب الهدايا من Firebase
  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiGifts?limit=200'
      );
      
      if (!response.ok) {
        throw new Error('فشل تحميل الهدايا');
      }
      
      const data = await response.json();
      
      if (data.ok && data.items) {
        setGifts(data.items);
        setFilteredGifts(data.items);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الهدايا');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...gifts];

    // البحث
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(gift => 
        gift.giftName?.toLowerCase().includes(term) ||
        gift.description?.toLowerCase().includes(term) ||
        gift.purpose?.toLowerCase().includes(term)
      );
    }

    // الترتيب
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name-asc':
        result.sort((a, b) => a.giftName.localeCompare(b.giftName, 'ar'));
        break;
      case 'name-desc':
        result.sort((a, b) => b.giftName.localeCompare(a.giftName, 'ar'));
        break;
      default:
        break;
    }

    setFilteredGifts(result);
  }, [gifts, searchTerm, sortBy]);

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
        
        {/* Description with Show More - 3 سطور فقط */}
        <p 
          className="gift-description-new" 
          style={{ 
            display: '-webkit-box',
            WebkitLineClamp: showFullDescription ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.4rem',
            marginBottom: '0.5rem'
          }}
        >
          {showFullDescription ? description : shortDescription}
        </p>

        {/* زرار عرض المزيد - يظهر لو الوصف أطول من 3 سطور */}
        {hasMoreContent && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // عشان ميروحش للصفحة لما تضغط الزرار
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
              gap: '0.3rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#7C3AED';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#8B5CF6';
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

  return (
    <div className="gifts-page">
      {/* Hero */}
      <section className="gifts-hero">
        <div className="container">
          <div className="hero-icon">
            <i className="fas fa-gift"></i>
          </div>
          <h1 className="hero-title">الهدايا المجانية</h1>
          <p className="hero-subtitle">
            اختر هديتك المفضلة واحصل عليها مجاناً من منصة وقت الذكاء
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="gifts-filters">
        <div className="container">
          <div className="filters-container">
            {/* Search */}
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="ابحث عن هدية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label className="filter-label">الترتيب:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="name-asc">الاسم: أ - ي</option>
                <option value="name-desc">الاسم: ي - أ</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <i className="fas fa-gift"></i>
            <span>{loading ? 'جاري التحميل...' : `${filteredGifts.length} هدية متاحة`}</span>
          </div>
        </div>
      </section>

      {/* Gifts Grid */}
      <section className="gifts-section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل الهدايا...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchGifts}>
                <i className="fas fa-redo"></i> إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !error && filteredGifts.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>لا توجد هدايا</h3>
              <p>لم نتمكن من العثور على هدايا تطابق بحثك</p>
            </div>
          )}

          {!loading && !error && filteredGifts.length > 0 && (
            <div className="gifts-grid">
              {filteredGifts.map(gift => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gifts-cta">
        <div className="container">
          <div className="cta-content">
            <i className="fas fa-sparkles"></i>
            <h2>هل تريد المزيد من الهدايا؟</h2>
            <p>تابعنا على منصات التواصل الاجتماعي لتحصل على أحدث الهدايا والعروض</p>
            <div className="social-buttons">
              <a href="#" className="social-btn twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-btn facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-btn instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-btn whatsapp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gifts;