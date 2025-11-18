// src/common/FloatingBtn.jsx - FIXED VERSION
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/FloatingBtn.css";

export default function FloatingBtn() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // Scroll hide/show logic
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down → show buttons
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up → hide buttons
        setIsVisible(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // WhatsApp message logic
  const getWhatsAppMessage = () => {
    const baseUrl = "https://wa.me/966XXXXXXXXX";

    let message = "السلام عليكم، أريد معرفة المزيد عن منصة وقت الذكاء";
    
    if (location.pathname === "/contact") {
      message = "السلام عليكم، لدي استفسار";
    } else if (location.pathname === "/products" || location.pathname.startsWith("/product-details")) {
      // Extract product name if available
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      let productName = "منتج من وقت الذكاء";
      
      if (productId) {
        const productMap = {
          "1": "ذكاء الأسر المنتجة",
          "2": "الذكاء المؤسسي",
          "3": "بطاقات الإتقان الذكية",
          "4": "منصة صفحات الهبوط",
          "5": "الأتمتة الذكية (Vibe Code)",
          "6": "الذكاءات المخصصة",
          "7": "برنامج وظيفة ذكية",
          "8": "منصة تبادل الخبرات",
          "9": "تحليلات الأعمال الذكية",
        };
        productName = productMap[productId] || productName;
      }
      
      message = `السلام عليكم، أريد الاستفسار عن ${productName}`;
    }

    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  };

  // Track WhatsApp click
  const trackWhatsAppClick = () => {
    // Google Analytics 4 (gtag)
    if (window.gtag) {
      window.gtag("event", "click", {
        event_category: "Floating Button",
        event_label: "WhatsApp",
        value: location.pathname,
      });
    }

    // Log to console for debugging
    console.log("[WhatsApp Click]", {
      timestamp: new Date().toISOString(),
      page: location.pathname,
      url: getWhatsAppMessage(),
    });
  };

  // ✅ FIX: Open/Close info panel handlers
  const openInfoPanel = () => {
    const panel = document.querySelector(".info-panel");
    if (panel) {
      panel.classList.add("active");
      // Prevent body scroll when panel is open
      document.body.style.overflow = "hidden";
    }
  };

  const closeInfoPanel = () => {
    const panel = document.querySelector(".info-panel");
    if (panel) {
      panel.classList.remove("active");
      // Restore body scroll
      document.body.style.overflow = "unset";
    }
  };

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href={getWhatsAppMessage()}
        className={`whatsapp-float ${isVisible ? "visible" : ""}`}
        target="_blank"
        rel="noreferrer"
        onClick={trackWhatsAppClick}
        aria-label="اتصل بنا عبر واتساب"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Info Button */}
      

      {/* Info Panel */}
      
    </>
  );
}