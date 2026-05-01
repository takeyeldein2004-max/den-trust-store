import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

function Navbar() {
  const { cart } = useCart()
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold">
            <span className="text-den-navy">DEN</span>{" "}
            <span className="text-den-red">TRUST</span>
          </h1>
          <p className="text-xs text-gray-500 -mt-1">ROOTED IN QUALITY</p>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="text-den-navy hover:text-den-red transition">
            Home
          </Link>
          <Link to="/products" className="text-den-navy hover:text-den-red transition">
            Products
          </Link>
          <Link to="/offers" className="text-den-navy hover:text-den-red transition">
            🔥 Offers
          </Link>
          <Link to="/contact" className="text-den-navy hover:text-den-red transition">
            Contact
          </Link>
          <Link to="/cart" className="relative text-den-navy hover:text-den-red transition">
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-den-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/offers" className="text-den-navy hover:text-den-red">
            🔥
          </Link>
          <Link to="/cart" className="text-den-navy hover:text-den-red">
            🛒 ({totalItems})
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar