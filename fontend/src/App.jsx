// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import SearchPage from "./components/SearchPage/SearchPage";
import LoginPage from "./components/LoginPage/LoginPage";
import CartPage from "./components/CartPage/CartPage";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import AdminOrders from "./components/AdminOrders/AdminOrders";
import AdminProducts from "./components/AdminProducts/AdminProducts";
import AdminUsers from "./components/AdminUsers/AdminUsers";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
import ChatBot from "./components/ChatBot/ChatBot";
import Footer from "./components/Footer/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Pages có Navbar + Footer */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/pc-gaming" element={<Layout><CategoryPage category="pc-gaming" /></Layout>} />
          <Route path="/laptop" element={<Layout><CategoryPage category="laptop" /></Layout>} />
          <Route path="/phu-kien" element={<Layout><CategoryPage category="phu-kien" /></Layout>} />
          <Route path="/khuyen-mai" element={<Layout><CategoryPage category="khuyen-mai" /></Layout>} />
          <Route path="/search" element={<Layout><SearchPage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          
          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
