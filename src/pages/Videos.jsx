import React, { useState, useRef } from "react";
import "../styles/videos.css";

const videoData = [
  {
    id: "featured",
    type: "featured",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "كيف تبدأ رحلتك مع الذكاء الاصطناعي",
    description:
      "دليل شامل للمبتدئين يشرح أساسيات الذكاء الاصطناعي وكيفية البدء في استخدامه في حياتك العملية والشخصية بطريقة بسيطة وفعالة.",
    category: "فيديو مميز هذا الأسبوع",
    stats: {
      views: "50K+",
      duration: "",
      label: "",
    },
    badge: true,
  },
  {
    id: "1",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "دليل استخدام ChatGPT للمبتدئين",
    description:
      "تعلم كيفية استخدام ChatGPT بشكل احترافي من البداية حتى الاحتراف",
    category: "دروس تعليمية",
    duration: "15:30",
    views: "5.2K مشاهدة",
    date: "منذ 3 أيام",
    type: "tutorials",
  },
  {
    id: "2",
    src: "",
    title: "10 نصائح لكتابة البرومبت المثالي",
    description:
      "اكتشف أسرار كتابة البرومبت الاحترافي للحصول على أفضل النتائج من الذكاء الاصطناعي",
    category: "نصائح وحيل",
    duration: "22:45",
    views: "8.7K مشاهدة",
    date: "منذ أسبوع",
    type: "tips",
  },
  {
    id: "3",
    src: "",
    title: "كيف حولت شركة ناشئة نفسها بالذكاء الاصطناعي",
    description:
      "قصة نجاح حقيقية لشركة سعودية استخدمت الذكاء الاصطناعي لتحقيق نمو 300%",
    category: "دراسات حالة",
    duration: "18:20",
    views: "3.1K مشاهدة",
    date: "منذ أسبوعين",
    type: "case-studies",
  },
  {
    id: "4",
    src: "",
    title: "ندوة: مستقبل الذكاء الاصطناعي في السعودية",
    description:
      "ندوة مباشرة مع خبراء الذكاء الاصطناعي حول التطورات والفرص في المملكة",
    category: "ندوات مباشرة",
    duration: "45:00",
    views: "12K مشاهدة",
    date: "منذ شهر",
    type: "webinars",
  },
  {
    id: "5",
    src: "",
    title: "إنشاء صور احترافية بالذكاء الاصطناعي",
    description: "تعلم استخدام أدوات الذكاء الاصطناعي لإنشاء صور احترافية مذهلة",
    category: "دروس تعليمية",
    duration: "12:15",
    views: "6.5K مشاهدة",
    date: "منذ 5 أيام",
    type: "tutorials",
  },
  {
    id: "6",
    src: "",
    title: "أتمتة أعمالك باستخدام Vibe Code",
    description:
      "دليل عملي لاستخدام تقنية Vibe Code في أتمتة العمليات اليومية",
    category: "نصائح وحيل",
    duration: "28:30",
    views: "4.2K مشاهدة",
    date: "منذ أسبوع",
    type: "tips",
  },
];

const videoStats = [
  { num: "150+", label: "فيديو تعليمي" },
  { num: "50K+", label: "مشاهدة" },
  { num: "25+", label: "ساعة محتوى" },
  { num: "4.8", label: "تقييم المشاهدين" },
];

const categories = [
  { key: "all", label: "جميع الفيديوهات", icon: "fas fa-th" },
  { key: "tutorials", label: "دروس تعليمية", icon: "fas fa-graduation-cap" },
  { key: "tips", label: "نصائح وحيل", icon: "fas fa-lightbulb" },
  { key: "case-studies", label: "دراسات حالة", icon: "fas fa-briefcase" },
  { key: "webinars", label: "ندوات مباشرة", icon: "fas fa-users" },
];

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [modalVideo, setModalVideo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // تصفية الفيديوهات حسب التاب والبحث
  const filteredVideos = videoData
    .filter((v) => v.id !== "featured")
    .filter(
      (v) =>
        (selectedCategory === "all" || v.type === selectedCategory) &&
        (v.title.includes(search) || v.description.includes(search))
    );

  // تشغيل الفيديو في المودال
  function playVideo(v) {
    setModalVideo(v.src || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1");
  }
  function closeModal() {
    setModalVideo(null);
  }

  // مشاركة الفيديو
  function shareVideo(platform, id) {
    const url = window.location.origin + "/video.html?id=" + id;
    const title = "شاهد هذا الفيديو الرائع من منصة وقت الذكاء";
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
        break;
      case "youtube":
        shareUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        break;
      default:
        break;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=400");
  }

  return (
    <div lang="ar" dir="rtl" className="videos-page">
     
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">مكتبة الفيديوهات</h1>
          <p className="page-subtitle">تعلم واكتشف عالم الذكاء الاصطناعي من خلال فيديوهات تعليمية متنوعة</p>
        </div>
      </section>
      {/* Filters */}
      <div className="filter-section">
        <div className="container">
          <div className="filter-container">
            <div className="filter-tabs">
              {categories.map((c) => (
                <button
                  key={c.key}
                  className={`tab-btn${selectedCategory === c.key ? " active" : ""}`}
                  onClick={() => setSelectedCategory(c.key)}
                >
                  <i className={c.icon}></i> {c.label}
                </button>
              ))}
            </div>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="ابحث في الفيديوهات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Featured Video */}
      <section className="videos-section">
        <div className="container">
          <div className="featured-video">
            <div className="featured-content">
              <div className="featured-player">
                <iframe
                  src={videoData[0].src}
                  title={videoData[0].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="featured-info">
                <span className="featured-badge">{videoData[0].category}</span>
                <h2 className="featured-title">{videoData[0].title}</h2>
                <p className="featured-description">{videoData[0].description}</p>
                <div className="share-buttons">
                  <div className="share-btn share-facebook" onClick={() => shareVideo("facebook", "featured")}>
                    <i className="fab fa-facebook-f"></i>
                  </div>
                  <div className="share-btn share-twitter" onClick={() => shareVideo("twitter", "featured")}>
                    <i className="fab fa-twitter"></i>
                  </div>
                  <div className="share-btn share-whatsapp" onClick={() => shareVideo("whatsapp", "featured")}>
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="share-btn share-youtube" onClick={() => shareVideo("youtube", "featured")}>
                    <i className="fab fa-youtube"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Statistics */}
          <div className="stats-section">
            <div className="stats-grid">
              {videoStats.map((s) => (
                <div className="stat-item" key={s.label}>
                  <div className="stat-number">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Video Grid */}
          <div className="videos-grid">
            {filteredVideos.map((v, i) => (
              <div className="video-card" key={v.id}>
                <div className="video-thumbnail">
                  {i === 0 ? (
                    <iframe
                      src={v.src || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="video-play-btn" onClick={() => playVideo(v)}>
                      <i className="fas fa-play"></i>
                    </div>
                  )}
                  <span className="video-duration">{v.duration}</span>
                  <span className="video-category">{v.category}</span>
                </div>
                <div className="video-content">
                  <h3 className="video-title">{v.title}</h3>
                  <div className="video-meta">
                    <span><i className="far fa-eye"></i> {v.views}</span>
                    <span><i className="far fa-calendar"></i> {v.date}</span>
                  </div>
                  <p className="video-description">{v.description}</p>
                  <div className="video-footer">
                    <a href="#" className="watch-btn" onClick={(e) => { e.preventDefault(); playVideo(v); }}>
                      مشاهدة الآن <i className="fas fa-play-circle"></i>
                    </a>
                    <div className="share-buttons">
                      <div className="share-btn share-facebook" onClick={() => shareVideo("facebook", v.id)}>
                        <i className="fab fa-facebook-f"></i>
                      </div>
                      <div className="share-btn share-whatsapp" onClick={() => shareVideo("whatsapp", v.id)}>
                        <i className="fab fa-whatsapp"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Load More */}
          <div className="load-more">
            <button className="btn btn-primary" onClick={() => alert("سيتم تحميل المزيد من الفيديوهات...")}>
              <i className="fas fa-plus"></i> تحميل المزيد من الفيديوهات
            </button>
          </div>
        </div>
      </section>
      
      {/* Video Modal */}
      {modalVideo && (
        <div className="video-modal active" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>✕</span>
            <iframe
              src={modalVideo}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="مشغل فيديو"
            ></iframe>
          </div>
        </div>
      )}
      {/* Info Button & Panel */}
      <div className="info-button" onClick={() => setShowInfo((v) => !v)}>
        <i className="fas fa-info"></i>
      </div>
      <div className={`info-panel${showInfo ? " active" : ""}`}>
        <span onClick={() => setShowInfo(false)} style={{ position: "absolute", top: 15, left: 15, fontSize: "1.5rem", cursor: "pointer" }}>✕</span>
        <h3 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>📋 معلومات صفحة الفيديوهات</h3>
        <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>🎯 الهدف من الصفحة:</h4>
        <p>عرض مكتبة فيديوهات تعليمية مع إمكانية المشاركة والتصنيف</p>
        <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>✨ المميزات:</h4>
        <ul style={{ listStyle: "none", paddingRight: "1rem" }}>
          <li>• تصنيف الفيديوهات</li>
          <li>• بحث في المحتوى</li>
          <li>• مشاركة على السوشيال ميديا</li>
          <li>• فيديو مميز</li>
          <li>• إحصائيات المشاهدة</li>
          <li>• مشغل فيديو Modal</li>
        </ul>
        <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>🔧 للمطور البرمجي:</h4>
        <ul style={{ listStyle: "none", paddingRight: "1rem" }}>
          <li>• ربط مع YouTube API</li>
          <li>• تنفيذ البحث والفلترة</li>
          <li>• تتبع المشاهدات</li>
          <li>• Lazy loading للفيديوهات</li>
          <li>• Video Analytics</li>
          <li>• Playlist functionality</li>
        </ul>
      </div>
    </div>
  );
}
