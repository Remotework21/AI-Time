import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/home.css";

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
