import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Preloader from "./components/Preloader" // <-- NEW IMPORT
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Contact from "./pages/Contact"
import Offers from "./pages/Offers"
import OfferDetail from "./pages/OfferDetail"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProducts from "./pages/AdminProducts"
import AdminOffers from "./pages/AdminOffers"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  // This will show the preloader for 2.5 seconds
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2500) // 2500 milliseconds = 2.5 seconds
  }, [])

  // Show Preloader while loading
  if (isLoading) {
    return <Preloader />
  }

  // Show the main app after loading
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offer/:id" element={<OfferDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
      </Routes>
    </Router>
  )
}

export default App