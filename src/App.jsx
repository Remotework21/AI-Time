import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollToTop } from "./utils/useScrollToTop";
import Header from "./common/Header";
import Footer from "./common/Footer";
import FloatingBtn from "./common/FloatingBtn";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import News from "./pages/News";
import Videos from "./pages/Videos";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import VibeCode from "./pages/VibeCode";
// import ProductRequest from "./pages/ProductRequest";
import Gifts from "./pages/Gifts"
import Article from './pages/Article';

export default function App() {
  useScrollToTop();
  return (
    <>
      <FloatingBtn />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gifts" element={<Gifts />} />

          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/vibecode" element={<VibeCode />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/news" element={<News />} />
          <Route path="/article" element={<Article />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/product_request" element={<ProductRequest />} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}
