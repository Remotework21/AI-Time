// src/main.jsx
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

/* Vendor CSS first (so our styles can override them) */
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* Project CSS (order matters) */
import "./styles/variables.css"; // CSS variables / theme tokens
import "./index.css"; // base / resets that use variables
import "./styles/header.css"; // header-specific styles
import "./styles/home.css"; // home / main content
import "./styles/footer.css"; // footer & floats

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
