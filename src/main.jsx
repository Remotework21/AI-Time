import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// ✅ Import all CSS files (order matters!)
import "./index.css";            // 1st: base styles ✅
import "./styles/variables.css"; // 2nd: variables
import "./styles/header.css";    // 3rd: header
import "./styles/home.css";      // 4th: main content
import "./styles/footer.css";    // 5th: footer & floats

function InitAOS() {
  useEffect(() => {
    if (window.AOS) window.AOS.init({ duration: 700, once: true });
  }, []);
  return null;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <InitAOS />
    <App />
  </BrowserRouter>
);
