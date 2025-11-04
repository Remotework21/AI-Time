export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>عن وقت الذكاء</h3>
            <p>
              منصة رائدة في تقديم حلول الذكاء الاصطناعي للشركات والأفراد في
              العالم العربي
            </p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>روابط سريعة</h3>
            <ul>
              <li>
                <a href="#products">المنتجات</a>
              </li>
              <li>
                <a href="#vibe-code">الفايب كود</a>
              </li>
              <li>
                <a href="#videos">الفيديوهات</a>
              </li>
              <li>
                <a href="#news">أخبار الذكاء</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>خدمات العملاء</h3>
            <ul>
              <li>
                <a href="#">الدعم الفني</a>
              </li>
              <li>
                <a href="#">الأسئلة الشائعة</a>
              </li>
              <li>
                <a href="#">تواصل معنا</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          جميع الحقوق محفوظة © {new Date().getFullYear()} منصة وقت الذكاء
        </div>
      </div>
    </footer>
  );
}
