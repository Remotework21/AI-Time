// src/common/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/AI-time-logo.png";
import { scrollToSection } from "../utils/scroll";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  // init theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setIsDark(saved === "dark");
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

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
            <a 
              href="#products" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("products");
                closeMenu();
              }}
            >
              المنتجات
            </a>
            <a 
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
            <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>
              تواصل معنا
            </Link>

            <div className="mobile-theme-toggle">
              <button className="theme-toggle" onClick={toggleTheme}>
                <i className={isDark ? "fas fa-sun" : "fas fa-moon"}></i>
                <span>{isDark ? "وضع النهار" : "وضع الليل"}</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="header-content">
          {/* Mobile Hamburger (LEFT) */}
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

          {/* CENTER: Logo */}
          <Link to="/" className="logo-image-center" onClick={closeMenu}>
            <img src={logo} alt="AI Time Logo" />
          </Link>

          {/* RIGHT: Slogan + Theme Toggle */}
          <div className="right-group">
            <Link to="/" className="logo-text-link" onClick={closeMenu}>
              <span className="logo-text">منصة وقت الذكاء</span>
            </Link>
            <button
              className="theme-toggle desktop-theme-toggle"
              onClick={toggleTheme}
              aria-label={
                isDark ? "تبديل إلى الوضع النهاري" : "تبديل إلى الوضع الليلي"
              }
            >
              <i className={isDark ? "fas fa-sun" : "fas fa-moon"}></i>
            </button>
          </div>

          {/* LEFT: Desktop Nav */}
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
            <a 
              href="#products" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("products");
              }}
            >
              المنتجات
            </a>
            <a 
              href="#vibe-code" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("vibe-code");
              }}
            >
              الفايب كود
            </a>
            <a 
              href="#videos" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("videos");
              }}
            >
              الفيديوهات
            </a>
            <a 
              href="#news" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("news");
              }}
            >
              أخبار الذكاء
            </a>
            <Link
              to="/contact"
              className={`nav-link${isActive("/contact") ? " active" : ""}`}
            >
              تواصل معنا
            </Link>
          </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
