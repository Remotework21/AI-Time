import React, { useState, useRef } from "react";
import "../styles/contact.css"; // هذا هو ملف الستايل الخارجي

export default function Contact() {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const fileInputRef = useRef(null);

  const handleColorClick = (color) => setSelectedColor(color);
  const handleRadioChange = (e) => setSelectedRadio(e.target.value);

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleFileClick = () => fileInputRef.current.click();

  const handleSubmit = (e) => {
    e.preventDefault();
    // اجمع البيانات
    const form = e.target;
    const data = {
      fullName: form.fullName.value,
      phone: form.phone.value,
      email: form.email.value,
      businessName: form.businessName.value,
      businessType: form.businessType.value,
      industry: form.industry.value,
      projectStatus: selectedRadio,
      problemDescription: form.problemDescription.value,
      solutionVision: form.solutionVision.value,
      features: selectedFeatures,
      designStyle: form.designStyle.value,
      language: form.language.value,
      preferredColors: selectedColor,
      budget: form.budget.value,
      urgency: form.urgency.value,
      notes: form.notes.value,
      timestamp: new Date().toISOString(),
    };
    // ... يمكنك إضافة رفع الملفات أو ربط الـAPI هنا
    alert("شكراً لك! تم استلام طلبك بنجاح.");
    form.reset();
    setSelectedColor("");
    setSelectedRadio("");
    setSelectedFeatures([]);
  };

  return (
    <div dir="rtl" lang="ar" className="request-page">
    
      
      <div className="container">
        {/* Hero */}
        <div className="form-hero">
          <h1>اطلب برنامجك المخصص</h1>
          <p>نحوّل أفكارك إلى برامج ذكية في 3-5 أيام فقط</p>
        </div>
        {/* Steps */}
        <div className="progress-steps">
          {["المعلومات الأساسية", "تفاصيل المشروع", "التصميم والتفضيلات", "الإرسال"].map((title, idx) => (
            <div className={`step${idx === 0 ? " active" : ""}`} key={title}>
              <div className={`step-number${idx === 0 ? " active" : ""}`}>{idx + 1}</div>
              <div className={`step-title${idx === 0 ? " active" : ""}`}>{title}</div>
            </div>
          ))}
        </div>
        {/* Form */}
        <div className="form-card">
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* 1. Basic Info */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-user"></i> المعلومات الأساسية
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    الاسم الكامل <span className="required">*</span>
                  </label>
                  <input type="text" name="fullName" required placeholder="أدخل اسمك الكامل" />
                </div>
                <div className="form-group">
                  <label>
                    رقم الجوال <span className="required">*</span>
                  </label>
                  <input type="tel" name="phone" required placeholder="05xxxxxxxx" pattern="[0-9]{10}" />
                </div>
                <div className="form-group">
                  <label>
                    البريد الإلكتروني <span className="required">*</span>
                  </label>
                  <input type="email" name="email" required placeholder="example@email.com" />
                </div>
                <div className="form-group">
                  <label>اسم الشركة/المؤسسة</label>
                  <input type="text" name="businessName" placeholder="اختياري" />
                </div>
              </div>
            </div>

            {/* 2. Project Type */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-briefcase"></i> نوع المشروع
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    نوع النشاط التجاري <span className="required">*</span>
                  </label>
                  <select name="businessType" required>
                    <option value="">اختر النوع</option>
                    <option value="startup">شركة ناشئة</option>
                    <option value="corporate">شركة كبرى</option>
                    <option value="charity">جمعية خيرية</option>
                    <option value="clinic">عيادة/مركز طبي</option>
                    <option value="restaurant">مطعم/كافيه</option>
                    <option value="retail">متجر تجزئة</option>
                    <option value="education">تعليم/تدريب</option>
                    <option value="personal">شخصي</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    القطاع/الصناعة <span className="required">*</span>
                  </label>
                  <input type="text" name="industry" required placeholder="مثال: التقنية، الصحة، التعليم" />
                </div>
                <div className="form-group full-width">
                  <label>
                    حالة المشروع <span className="required">*</span>
                  </label>
                  <div className="radio-group">
                    {[
                      { value: "idea", label: "فكرة من الصفر" },
                      { value: "documented", label: "فكرة مكتوبة ومحددة" },
                      { value: "existing", label: "برنامج موجود يحتاج تطوير" },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className={`radio-item${selectedRadio === item.value ? " selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="projectStatus"
                          value={item.value}
                          checked={selectedRadio === item.value}
                          onChange={handleRadioChange}
                          required
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Problem Description */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-exclamation-circle"></i> وصف المشكلة والحل المطلوب
              </h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    ما هي المشكلة التي تريد حلها؟ <span className="required">*</span>
                  </label>
                  <textarea name="problemDescription" required placeholder="اشرح المشكلة التي تواجهها في عملك أو مشروعك..."></textarea>
                </div>
                <div className="form-group full-width">
                  <label>ما هو الحل الذي تتخيله؟</label>
                  <textarea name="solutionVision" placeholder="صف كيف تتخيل الحل المثالي لهذه المشكلة..."></textarea>
                </div>
                <div className="form-group full-width">
                  <label>
                    الميزات المطلوبة في البرنامج <span className="required">*</span>
                  </label>
                  <div className="checkbox-group">
                    {[
                      { value: "dashboard", label: "لوحة تحكم" },
                      { value: "reports", label: "تقارير وإحصائيات" },
                      { value: "users", label: "إدارة مستخدمين" },
                      { value: "notifications", label: "تنبيهات وإشعارات" },
                      { value: "payment", label: "نظام دفع" },
                      { value: "inventory", label: "إدارة مخزون" },
                      { value: "booking", label: "نظام حجز" },
                      { value: "chat", label: "دردشة/دعم" },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className={`checkbox-item${selectedFeatures.includes(item.value) ? " selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="features"
                          value={item.value}
                          checked={selectedFeatures.includes(item.value)}
                          onChange={() => handleFeatureToggle(item.value)}
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Design Preferences */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-palette"></i> التصميم والتفضيلات البصرية
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    نمط التصميم المفضل <span className="required">*</span>
                  </label>
                  <select name="designStyle" required>
                    <option value="">اختر النمط</option>
                    <option value="modern">عصري ونظيف</option>
                    <option value="classic">كلاسيكي ورسمي</option>
                    <option value="playful">مرح وحيوي</option>
                    <option value="minimal">بسيط ومختصر</option>
                    <option value="corporate">احترافي للشركات</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    اللغة المطلوبة <span className="required">*</span>
                  </label>
                  <select name="language" required>
                    <option value="">اختر اللغة</option>
                    <option value="arabic">العربية فقط</option>
                    <option value="english">الإنجليزية فقط</option>
                    <option value="both">العربية والإنجليزية</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>الألوان المفضلة</label>
                  <div className="color-picker">
                    {[
                      { color: "purple", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                      { color: "pink", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                      { color: "blue", bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
                      { color: "green", bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
                      { color: "warm", bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
                      { color: "cool", bg: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
                    ].map((item) => (
                      <div
                        key={item.color}
                        className={`color-option${selectedColor === item.color ? " selected" : ""}`}
                        style={{ background: item.bg }}
                        onClick={() => handleColorClick(item.color)}
                        title={item.color}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Budget & Timeline */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-clock"></i> الميزانية والوقت
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    الميزانية المتوقعة <span className="required">*</span>
                  </label>
                  <select name="budget" required>
                    <option value="">اختر الميزانية</option>
                    <option value="low">أقل من 5,000 ريال</option>
                    <option value="medium">5,000 - 15,000 ريال</option>
                    <option value="high">15,000 - 30,000 ريال</option>
                    <option value="premium">أكثر من 30,000 ريال</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    سرعة التنفيذ المطلوبة <span className="required">*</span>
                  </label>
                  <select name="urgency" required>
                    <option value="">اختر السرعة</option>
                    <option value="urgent">عاجل (3 أيام)</option>
                    <option value="fast">سريع (أسبوع)</option>
                    <option value="normal">عادي (أسبوعين)</option>
                    <option value="flexible">مرن (شهر)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 6. Files */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-paperclip"></i> ملفات إضافية (اختياري)
              </h2>
              <div className="file-upload" onClick={handleFileClick}>
                <div className="file-upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <p>اضغط هنا لرفع ملفات</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                  (شعار، صور، وثائق، عروض تقديمية)
                </p>
                <input type="file" ref={fileInputRef} name="files" multiple style={{ display: "none" }} />
              </div>
            </div>

            {/* 7. Additional Notes */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-comment"></i> ملاحظات إضافية
              </h2>
              <div className="form-group full-width">
                <textarea name="notes" placeholder="أي معلومات إضافية تريد إخبارنا بها..."></textarea>
              </div>
            </div>

            {/* Submit */}
            <div className="submit-section">
              <button type="submit" className="submit-btn">
                <i className="fas fa-paper-plane"></i> إرسال الطلب
              </button>
              <p className="terms">
                بالضغط على إرسال، أنت توافق على{" "}
                <a href="#">الشروط والأحكام</a> و
                <a href="#">سياسة الخصوصية</a>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* Info Button */}
      <div className="info-button" onClick={() => setShowInfo((v) => !v)}>
        <i className="fas fa-info"></i>
      </div>
      {/* Info Panel */}
      <div className={`info-panel${showInfo ? " active" : ""}`}>
        <span className="close-info" onClick={() => setShowInfo(false)}>
          ✕
        </span>
        <h3>📋 معلومات صفحة طلب البرنامج</h3>
        <h4>🎯 الهدف من الصفحة:</h4>
        <p>جمع معلومات شاملة عن متطلبات العميل لتطوير برنامج مخصص بتقنية الفايب كود</p>
        <h4>📊 البيانات المجموعة:</h4>
        <ul>
          <li>معلومات الاتصال الأساسية</li>
          <li>نوع وطبيعة المشروع</li>
          <li>وصف تفصيلي للمشكلة والحل</li>
          <li>الميزات المطلوبة</li>
          <li>التفضيلات البصرية</li>
          <li>الميزانية والجدول الزمني</li>
        </ul>
        <h4>🔧 للمطور البرمجي:</h4>
        <ul>
          <li>النموذج يجب أن يرسل إلى API endpoint</li>
          <li>التحقق من الحقول المطلوبة قبل الإرسال</li>
          <li>رفع الملفات إلى cloud storage</li>
          <li>إرسال إشعار للفريق عند استلام طلب</li>
          <li>حفظ البيانات في قاعدة البيانات</li>
          <li>إرسال بريد تأكيد للعميل</li>
        </ul>
        <h4>📝 البيانات المرسلة (JSON):</h4>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: 5, fontSize: "0.8rem" }}>
{`{
  "fullName": "string",
  "phone": "string",
  "email": "string",
  "businessName": "string",
  "businessType": "string",
  "industry": "string",
  "projectStatus": "string",
  "problemDescription": "text",
  "solutionVision": "text",
  "features": ["array"],
  "designStyle": "string",
  "language": "string",
  "preferredColors": "string",
  "budget": "string",
  "urgency": "string",
  "files": ["array"],
  "notes": "text",
  "timestamp": "datetime"
}`}
        </pre>
      </div>
    </div>
  );
}
