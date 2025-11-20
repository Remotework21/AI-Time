// src/hooks/useScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // تمرير ناعم لأعلى الصفحة
    window.scrollTo({
      top: 0,
      behavior: "smooth", // غيّر إلى "auto" للقفز الفوري
    });
  }, [pathname]); // ← يُنفَّذ في كل مرة يتغير فيها الرابط
}