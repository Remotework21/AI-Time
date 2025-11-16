// Products.jsx
// صفحة عرض جميع المنتجات مع البحث والفلترة
// API: https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Categories
  const [categories, setCategories] = useState(['الكل']);
  const statuses = ['الكل', 'متاح', 'قريباً', 'تحت التطوير'];

  // في أول الـ component مع الـ states التانية
const [gifts, setGifts] = useState([]);
const [filteredGifts, setFilteredGifts] = useState([]);

  // API: جلب المنتجات من Firebase
  useEffect(() => {
   fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // جلب المنتجات
    const productsResponse = await fetch(
      'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiProducts?limit=200'
    );
    
    // جلب الهدايا
    const giftsResponse = await fetch(
      'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/publicAiGifts?limit=200'
    );
    
    if (!productsResponse.ok || !giftsResponse.ok) {
      throw new Error('فشل تحميل البيانات');
    }
    
    const productsData = await productsResponse.json();
    const giftsData = await giftsResponse.json();
    
    if (productsData.ok && productsData.items) {
      setProducts(productsData.items);
      setFilteredProducts(productsData.items);
      
      const uniqueCategories = ['الكل', ...new Set(
        productsData.items.map(p => p.subCategory).filter(Boolean)
      )];
      setCategories(uniqueCategories);
    }
    
    if (giftsData.ok && giftsData.items) {
      setGifts(giftsData.items);
      setFilteredGifts(giftsData.items);
    }
  } catch (err) {
    setError('حدث خطأ أثناء تحميل البيانات');
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};
  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...products];

    // البحث
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.targetAudiences?.toLowerCase().includes(term) ||
        product.subCategory?.toLowerCase().includes(term)
      );
    }

    // فلتر الفئة
    if (selectedCategory !== 'الكل') {
      result = result.filter(p => p.subCategory === selectedCategory);
    }

    // فلتر الحالة
    if (selectedStatus !== 'الكل') {
      result = result.filter(p => p.readinessStatus === selectedStatus);
    }

    // الترتيب
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => (a.customerPrice || 0) - (b.customerPrice || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.customerPrice || 0) - (a.customerPrice || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // تنسيق السعر
  const formatPrice = (price) => {
    if (!price || price === 0) return 'مجاني';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // أيقونة المنتج حسب الفئة
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

  // بطاقة المنتج
  // بطاقة المنتج - التصميم الجديد
const ProductCard = ({ product }) => {
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

        {/* Info Circle */}
        <div className="info-circle">
          <i className="fas fa-info"></i>
        </div>
      </div>
    </div>
  );
};

// بطاقة الهدية
// const GiftCard = ({ gift }) => (
//   <div className="product-card-new" onClick={() => navigate(`/gift/${gift.id}`)}>
//     <div className="product-header-gradient">
//       <div className="product-icon-large">
//         <i className="fas fa-gift"></i>
//       </div>
//       <div className="status-badge-top">
//         <span className="status-badge status-gift">
//           هدية
//         </span>
//       </div>
//     </div>

//     <div className="product-content-white">
//       <h3 className="product-title-new">{gift.giftName}</h3>
//       <p className="product-description-new">
//         {gift.description || gift.purpose || 'هدية مميزة'}
//       </p>

//       <button className="product-action-btn">
//         اعرف المزيد
//         <i className="fas fa-arrow-left"></i>
//       </button>

//       <div className="info-circle">
//         <i className="fas fa-info"></i>
//       </div>
//     </div>
//   </div>
// );

  return (
    <div className="products-page">
      {/* Hero */}
      <section className="products-hero">
        <div className="container">
          <h1 className="hero-title">منتجات الذكاء الاصطناعي</h1>
          <p className="hero-subtitle">
            اكتشف مجموعة متنوعة من حلول الذكاء الاصطناعي
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="products-filters">
        <div className="container">
          <div className="filters-container">
            {/* Search */}
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="ابحث عن منتج..."
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

            {/* Category */}
            <div className="filter-group">
              <label className="filter-label">الفئة:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label className="filter-label">الحالة:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
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
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="name-asc">الاسم: أ - ي</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <i className="fas fa-box"></i>
            <span>{loading ? 'جاري التحميل...' : `${filteredProducts.length} منتج`}</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchProducts}>
                <i className="fas fa-redo"></i> إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>لا توجد منتجات</h3>
              <p>لم نتمكن من العثور على منتجات تطابق بحثك</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
     
{/* Gifts Section */}
{/* {!loading && gifts.length > 0 && (
  <section className="gifts-section">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-gift"></i>
          الهدايا المتاحة
        </h2>
        <p className="section-subtitle">اختر الهدية المناسبة لك</p>
      </div>

      <div className="products-grid-new">
        {filteredGifts.map(gift => (
          <GiftCard key={gift.id} gift={gift} />
        ))}
      </div>
    </div>
  </section>
)} */}
    </div>
  );
};

export default Products;