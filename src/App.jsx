import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Header from "./common/Header.jsx";
import Footer from "./common/Footer.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
