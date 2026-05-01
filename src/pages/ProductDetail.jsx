import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { useCart } from "../context/CartContext"

function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() })
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Product not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-block mb-8 text-den-navy hover:text-den-red font-medium"
        >
          ← Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            {/* LEFT: Product Image */}
            <div className="bg-gray-100 flex items-center justify-center p-8">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image Available</span>
                </div>
              )}
            </div>

            {/* RIGHT: Product Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <span className="inline-block bg-den-light-blue text-den-navy text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {product.category}
                </span>

                {/* Product Name */}
                <h1 className="text-3xl font-bold text-den-navy mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Price per unit</p>
                  <p className="text-4xl font-bold text-den-red">
                    {product.price} EGP
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-den-navy mb-2">
                    Product Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description ||
                      "This is a high-quality dental material trusted by professionals. Contact us for more details about this product."}
                  </p>
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div>
                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 bg-gray-200 rounded-full font-bold text-xl hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-bold text-2xl border-2 border-gray-200 rounded-lg py-1">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 bg-gray-200 rounded-full font-bold text-xl hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-den-light-blue rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm text-den-navy">Total for this item</p>
                  <p className="text-2xl font-bold text-den-navy">
                    {product.price * qty} EGP
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-den-navy text-white hover:bg-den-red"
                  }`}
                >
                  {added ? "✅ Added to Cart!" : `Add ${qty} to Cart`}
                </button>

                {/* Go to Cart */}
                {added && (
                  <Link
                    to="/cart"
                    className="block text-center mt-3 text-den-navy hover:text-den-red font-medium underline"
                  >
                    Go to Cart →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail