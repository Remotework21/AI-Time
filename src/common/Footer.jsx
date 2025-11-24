import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>عن وقت الذكاء</h3>
            <p>
              منصة رائدة في تقديم حلول الذكاء الاصطناعي للشركات والأفراد في العالم العربي
            </p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h3>روابط سريعة</h3>
            <ul>
              <li><Link to="/products">المنتجات</Link></li>
              <li><Link to="/vibecode">برمجة بالذكاء الاصطناعي</Link></li>
              <li><Link to="/videos">الفيديوهات</Link></li>
              <li><Link to="/news">أخبار الذكاء</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>خدمات العملاء</h3>
            <ul>
              {/* <li><Link to="/product_request">طلب منتج</Link></li> */}
              <li><Link to="/faq">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact">تواصل معنا</Link></li>
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
