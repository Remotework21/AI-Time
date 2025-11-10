import React, { useState } from "react";

export default function About() {
  // حالة Info Panel
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div dir="rtl" lang="ar" className="bg-light">
      

      {/* Page Hero */}
      <section className="text-center text-white py-5" style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)", borderRadius: 24, margin: "2rem 0" }}>
        <div className="container">
          <h1 className="fw-bold mb-3" style={{ fontSize: "2.8rem" }}>من نحن</h1>
          <p className="lead mb-0">رحلتنا في عالم الذكاء الاصطناعي</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <h3 className="fw-bold text-primary mb-3">قصتنا</h3>
              <p className="mb-3">
                بدأت رحلتنا في عام 2022 برؤية واضحة: جعل الذكاء الاصطناعي متاحاً وسهل الاستخدام للجميع في العالم العربي.
                من خلال خبرتنا الممتدة لعدة سنوات، طورنا حلولاً مبتكرة تناسب احتياجات السوق المحلي.
              </p>
              <p className="mb-4">
                نفخر بكوننا رائدين في تقديم حلول الذكاء الاصطناعي باللغة العربية، مع التركيز على البساطة والفعالية. لقد ساعدنا عملاءنا في تحويل أعمالهم رقمياً وتحقيق نتائج استثنائية.
              </p>
              <a href="/products" className="btn btn-primary rounded-pill px-4">
                <i className="fas fa-rocket me-2"></i>
                اكتشف منتجاتنا
              </a>
            </div>
            <div className="col-md-6">
              <div className="bg-white shadow rounded-4 d-flex align-items-center justify-content-center" style={{ height: 320 }}>
                <i className="fas fa-brain text-primary" style={{ fontSize: "7rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-white" style={{ background: "#f8f8fc" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">رسالتنا ورؤيتنا</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100 text-center p-4">
                <div className="mx-auto mb-3 bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 68, height: 68 }}>
                  <i className="fas fa-bullseye text-white fs-3"></i>
                </div>
                <h3 className="mb-3 text-primary">رسالتنا</h3>
                <p className="mb-0">تمكين الأفراد والشركات في العالم العربي من الاستفادة من قوة الذكاء الاصطناعي لتحقيق أهدافهم وتطوير أعمالهم بطريقة مبتكرة وفعالة.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100 text-center p-4">
                <div className="mx-auto mb-3 bg-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: 68, height: 68 }}>
                  <i className="fas fa-eye text-white fs-3"></i>
                </div>
                <h3 className="mb-3 text-danger">رؤيتنا</h3>
                <p className="mb-0">أن نصبح المنصة الرائدة في الشرق الأوسط لحلول الذكاء الاصطناعي، ونساهم في بناء مستقبل رقمي متقدم للمجتمعات العربية.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">قيمنا</h2>
            <p className="text-muted mb-0">المبادئ التي توجه عملنا وقراراتنا</p>
          </div>
          <div className="row g-4">
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm text-center p-3">
                <div className="fs-2 mb-2">🚀</div>
                <h4 className="mb-1">الابتكار</h4>
                <div className="text-muted" style={{ fontSize: "0.98rem" }}>نسعى دائماً لتطوير حلول مبتكرة ومتقدمة</div>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm text-center p-3">
                <div className="fs-2 mb-2">🎯</div>
                <h4 className="mb-1">الجودة</h4>
                <div className="text-muted" style={{ fontSize: "0.98rem" }}>نلتزم بأعلى معايير الجودة في جميع منتجاتنا</div>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm text-center p-3">
                <div className="fs-2 mb-2">🤝</div>
                <h4 className="mb-1">الثقة</h4>
                <div className="text-muted" style={{ fontSize: "0.98rem" }}>نبني علاقات طويلة الأمد مع عملائنا</div>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm text-center p-3">
                <div className="fs-2 mb-2">⚡</div>
                <h4 className="mb-1">السرعة</h4>
                <div className="text-muted" style={{ fontSize: "0.98rem" }}>ننجز المشاريع في وقت قياسي دون المساس بالجودة</div>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm text-center p-3">
                <div className="fs-2 mb-2">💡</div>
                <h4 className="mb-1">البساطة</h4>
                <div className="text-muted" style={{ fontSize: "0.98rem" }}>نجعل التقنية سهلة ومتاحة للجميع</div>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm text-center p-3">
                <div className="fs-2 mb-2">🌟</div>
                <h4 className="mb-1">التميز</h4>
                <div className="text-muted" style={{ fontSize: "0.98rem" }}>نسعى للتفوق في كل ما نقدمه</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-white" style={{ background: "#f8f8fc" }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">فريقنا المتميز</h2>
            <p className="text-muted mb-0">خبراء متخصصون في الذكاء الاصطناعي والتقنية</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center p-4">
                <div className="mx-auto mb-3 bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{ width: 90, height: 90 }}>
                  <i className="fas fa-user text-white fs-2"></i>
                </div>
                <h4 className="mb-1">أحمد محمد</h4>
                <div className="text-primary mb-2">المؤسس والرئيس التنفيذي</div>
                <div className="d-flex justify-content-center gap-2">
                  <a href="#" className="btn btn-light rounded-circle"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="btn btn-light rounded-circle"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="btn btn-light rounded-circle"><i className="fab fa-github"></i></a>
                </div>
              </div>
            </div>
            {/* ... كرر أعضاء الفريق حسب الحاجة ... */}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">رحلتنا عبر الزمن</h2>
          </div>
          {/* Timeline */}
          <div className="position-relative">
            {/* خط زمني رأسي */}
            <div className="position-absolute top-0 start-50 translate-middle-x bg-primary bg-gradient" style={{ width: "4px", height: "100%", zIndex: 0, borderRadius: 2 }}></div>
            {/* عناصر الجدول الزمني */}
            <div className="row g-5 position-relative">
              <div className="col-md-6 offset-md-6 position-relative">
                <div className="bg-white shadow-sm rounded-4 p-4 mb-4 ms-5 position-relative">
                  <span className="badge bg-primary mb-2 fs-5">2023</span>
                  <div className="fw-bold mb-2">البداية</div>
                  <div className="text-muted">تأسيس المنصة برؤية واضحة لتقديم حلول ذكية</div>
                  <span className="position-absolute top-50 start-0 translate-middle-y bg-primary rounded-circle" style={{ width: 20, height: 20, border: "4px solid #fff", left: -40, zIndex: 1 }}></span>
                </div>
              </div>
              <div className="col-md-6 position-relative">
                <div className="bg-white shadow-sm rounded-4 p-4 mb-4 me-5 position-relative">
                  <span className="badge bg-danger mb-2 fs-5">2024</span>
                  <div className="fw-bold mb-2">التوسع</div>
                  <div className="text-muted">إطلاق أول منتجاتنا</div>
                  <span className="position-absolute top-50 end-0 translate-middle-y bg-danger rounded-circle" style={{ width: 20, height: 20, border: "4px solid #fff", right: -40, zIndex: 1 }}></span>
                </div>
              </div>
              <div className="col-md-6 offset-md-6 position-relative">
                <div className="bg-white shadow-sm rounded-4 p-4 mb-4 ms-5 position-relative">
                  <span className="badge bg-info mb-2 fs-5">2022</span>
                  <div className="fw-bold mb-2">الابتكار</div>
                  <div className="text-muted">تطوير تقنية Vibe Code للأتمتة السريعة</div>
                  <span className="position-absolute top-50 start-0 translate-middle-y bg-info rounded-circle" style={{ width: 20, height: 20, border: "4px solid #fff", left: -40, zIndex: 1 }}></span>
                </div>
              </div>
              <div className="col-md-6 position-relative">
                <div className="bg-white shadow-sm rounded-4 p-4 mb-4 me-5 position-relative">
                  <span className="badge bg-success mb-2 fs-5">2025</span>
                  <div className="fw-bold mb-2">الريادة</div>
                  <div className="text-muted">مشروعات منجزة</div>
                  <span className="position-absolute top-50 end-0 translate-middle-y bg-success rounded-circle" style={{ width: 20, height: 20, border: "4px solid #fff", right: -40, zIndex: 1 }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary bg-gradient text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-2">انضم إلى رحلتنا</h2>
          <p className="lead mb-4">كن جزءاً من قصة نجاحنا واستفد من خبراتنا</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="/contact" className="btn btn-light rounded-pill px-4 text-primary">
              <i className="fas fa-phone me-2"></i> تواصل معنا
            </a>
            <a href="/products" className="btn btn-outline-light rounded-pill px-4">
              <i className="fas fa-rocket me-2"></i> اكتشف منتجاتنا
            </a>
          </div>
        </div>
      </section>

      

      {/* WhatsApp Float */}
      <a href="https://wa.me/966500000000" className="position-fixed bottom-0 end-0 m-4 shadow-lg btn btn-success rounded-circle" style={{ zIndex: 1100, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Info Button */}
      <button className="position-fixed bottom-0 start-0 m-4 btn btn-info rounded-circle shadow-lg" style={{ zIndex: 1100, width: 54, height: 54, fontSize: 22 }}
        onClick={() => setShowInfo((s) => !s)}
      >
        <i className="fas fa-info"></i>
      </button>

      {/* Info Panel */}
      {showInfo && (
        <div className="position-fixed bottom-0 start-0 mb-5 ms-4 bg-white border shadow-lg rounded-4 p-4" style={{ width: 350, maxWidth: "95vw", zIndex: 1200 }}>
          <span onClick={() => setShowInfo(false)} style={{ position: "absolute", top: 15, left: 15, fontSize: "1.5rem", cursor: "pointer" }}>✕</span>
          <h3 className="mb-3 text-primary">📋 معلومات صفحة من نحن</h3>
          <h4 className="mb-1 mt-2">🎯 الهدف من الصفحة:</h4>
          <p>تعريف الزوار بالمنصة وقصتها ورؤيتها وفريق العمل</p>
          <h4 className="mb-1 mt-2">✨ المميزات:</h4>
          <ul className="ps-3">
            <li>• قصة المنصة</li>
            <li>• الرؤية والرسالة</li>
            <li>• القيم</li>
            <li>• فريق العمل</li>
            <li>• Timeline للإنجازات</li>
          </ul>
          <h4 className="mb-1 mt-2">🔧 للمطور البرمجي:</h4>
          <ul className="ps-3">
            <li>• إضافة صور حقيقية للفريق</li>
            <li>• تحديث Timeline ديناميكياً</li>
            <li>• ربط Social Media</li>
          </ul>
        </div>
      )}
    </div>
  );
}
