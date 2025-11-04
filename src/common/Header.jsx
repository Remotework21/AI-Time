import { Link } from "react-router-dom";

export default function Header() {
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  return (
    <header className="header" id="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/src/assets/AI-time-logo.png" alt="AI Time Logo" />
            <span className="logo-text">منصة وقت الذكاء</span>
          </Link>

          <nav className="nav-menu">
            <a href="#home" className="nav-link">
              الرئيسية
            </a>
            <Link to="/about" className="nav-link">
              من نحن
            </Link>
            <a href="#products" className="nav-link">
              المنتجات
            </a>
            <a href="#vibe-code" className="nav-link">
              الفايب كود
            </a>
            <a href="#videos" className="nav-link">
              الفيديوهات
            </a>
            <a href="#news" className="nav-link">
              أخبار الذكاء
            </a>

            <button className="theme-toggle" onClick={toggleTheme}>
              <i className="fas fa-moon" id="themeIcon"></i>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
