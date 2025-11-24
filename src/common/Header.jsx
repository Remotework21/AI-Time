// src/common/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/AI-time-logo_cr.png";
import { scrollToSection } from "../utils/scroll";

export default function Header() {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const location = useLocation();


  const isActive = (to) => location.pathname === to;

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="header" id="header">
      <div className="container">
        {/* Mobile Overlay & Menu */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
        )}

        <nav
          className={`mobile-menu ${isMenuOpen ? "active" : ""}`}
          aria-hidden={!isMenuOpen}
        >
          <button
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="إغلاق"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
              الرئيسية
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>
              من نحن
            </Link>
            <Link
              to="/products"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              المنتجات
            </Link>
            {/* <a 
              href="/products" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("products");
                closeMenu();
              }}
            >
              المنتجات
            </a> */}
            {/* <a 
              href="#vibe-code" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("vibe-code");
                closeMenu();
              }}
            >
              الفايب كود
            </a>
            <a 
              href="#videos" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("videos");
                closeMenu();
              }}
            >
              الفيديوهات
            </a>
            <a 
              href="#news" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("news");
                closeMenu();
              }}
            >
              أخبار الذكاء

            </a>
            </a> */}
            <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>
              تواصل معنا
            </Link>
          </div>
        </nav>

        <div className="header-content">
          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* RIGHT GROUP (Desktop: right | Mobile: center) */}
          <div className="right-group">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              <img src={logo} alt="AI Time Logo" className="logo-image" />
            </Link>
          </div>

          {/* LEFT: Desktop Nav (hidden on mobile) */}
          <div className="desktop-nav-group">
            <nav className="nav-menu desktop-menu">
              <Link
                to="/"
                className={`nav-link${isActive("/") ? " active" : ""}`}
              >
                الرئيسية
              </Link>
              <Link
                to="/about"
                className={`nav-link${isActive("/about") ? " active" : ""}`}
              >
                من نحن
              </Link>
              <Link
                to="/products"
                className={`nav-link${isActive("/products") ? " active" : ""}`}
              >
                المنتجات
              </Link>
              <Link
                to="/vibecode"
                className={`nav-link${isActive("/vibecode") ? " active" : ""}`}
              >
                برمجة بالذكاء الاصطناعي
              </Link>
              <Link
                to="/videos"
                className={`nav-link${isActive("/videos") ? " active" : ""}`}
              >
                الفيديوهات
              </Link>

              <Link
                to="/news"
                className={`nav-link${isActive("/news") ? " active" : ""}`}
              >
                أخبار الذكاء
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
