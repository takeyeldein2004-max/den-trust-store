import { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import { db } from "../firebase/config"
import { collection, getDocs } from "firebase/firestore"
import { Link } from "react-router-dom"

function Products() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"))
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle quantity change
  const handleQtyChange = (id, value) => {
    const num = parseInt(value)
    if (num >= 1) {
      setQuantities((prev) => ({ ...prev, [id]: num }))
    }
  }

  // Increase quantity
  const increaseQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }))
  }

  // Decrease quantity
  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }))
  }

  // Handle add to cart
  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1
    console.log("Adding to cart:", product.name, "Quantity:", qty)
    addToCart(product, qty)
    // Reset quantity after adding
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }))
  }

  if (loading) return <p className="text-center p-10">Loading products...</p>

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-den-navy mb-8 text-center">
          Our Products
        </h1>

        {/* ═══════════════════════════════════════ */}
        {/* SEARCH BAR WITH LIVE DROPDOWN           */}
        {/* ═══════════════════════════════════════ */}
        <div className="mb-8 max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="🔍 Search for dental materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-den-navy"
          />

          {/* Live Search Dropdown */}
          {searchTerm && searchFocused && filteredProducts.length > 0 && (
            <div className="absolute w-full bg-white shadow-lg rounded-b-lg border mt-1 z-50 max-h-60 overflow-y-auto">
              {filteredProducts.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center p-3 hover:bg-gray-100 border-b"
                >
                  {/* Small image in dropdown */}
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center text-xs text-gray-400">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-den-navy">{p.name}</p>
                    <p className="text-sm text-den-red font-bold">
                      {p.price} EGP
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results message */}
          {searchTerm && searchFocused && filteredProducts.length === 0 && (
            <div className="absolute w-full bg-white shadow-lg rounded-b-lg border mt-1 z-50 p-3 text-center text-gray-500">
              No products found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* PRODUCT GRID                            */}
        {/* ═══════════════════════════════════════ */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            No products found.
          </p>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
              >
                {/* Product Image - Clickable */}
                <Link to={`/product/${product.id}`}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded mb-4"
                    />
                  ) : (
                    <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <h2 className="text-lg font-semibold text-den-navy mb-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category}
                  </p>
                  <p className="text-den-red font-bold text-lg mb-4">
                    {product.price} EGP
                  </p>
                </Link>

                {/* ═══════════════════════════════ */}
                {/* QUANTITY COUNTER                 */}
                {/* ═══════════════════════════════ */}
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <button
                    onClick={() => decreaseQty(product.id)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-300"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQtyChange(product.id, e.target.value)
                    }
                    min="1"
                    className="w-14 text-center border-2 border-gray-300 rounded p-1 font-bold text-lg focus:border-den-navy focus:outline-none"
                  />

                  <button
                    onClick={() => increaseQty(product.id)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-den-navy text-white py-2 rounded-lg hover:bg-den-red transition font-semibold"
                >
                  Add to Cart ({quantities[product.id] || 1})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products