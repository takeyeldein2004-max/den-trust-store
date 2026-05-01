import { useCart } from "../context/CartContext"
import { useState } from "react"
import { db } from "../firebase/config"
import { collection, addDoc, Timestamp } from "firebase/firestore"

function Cart() {
  const { cart, incrementQty, decrementQty, removeItem, clearCart } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("Sending order...")

    const formData = new FormData(e.target)

    const orderDetails = {
      doctorName: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        qty: item.qty,
      })),
      total: getTotal(),
      status: "pending",
      createdAt: Timestamp.now(),
    }

    try {
      await addDoc(collection(db, "orders"), orderDetails)
      setOrderPlaced(true)
      clearCart()
    } catch (error) {
      setMessage("ERROR: " + error.message)
    }

    setLoading(false)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white shadow-lg rounded-lg p-10 max-w-md">
          <div className="text-6xl mb-4">🦷</div>
          <h2 className="text-4xl font-bold text-den-navy mb-4">
            Thank You, Doctor!
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Your order has been received successfully.
          </p>
          <p className="text-gray-500">
            We will contact you shortly to confirm delivery.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-den-navy mb-8 text-center">
          Your Booking
        </h1>

        {message && (
          <div className="mb-4 bg-yellow-100 text-yellow-800 p-3 rounded text-center font-medium">
            {message}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty.</p>
            <a
              href="/products"
              className="bg-den-navy text-white px-6 py-3 rounded-lg hover:bg-den-red transition"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                Order Summary
              </h2>

              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-den-navy">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <p className="text-sm text-gray-500">
                      {item.price} EGP x {item.qty}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mx-4">
                    <button
                      onClick={() => decrementQty(item.id)}
                      className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => incrementQty(item.id)}
                      className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-den-red">
                      {item.price * item.qty} EGP
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t flex justify-between font-bold text-xl text-den-navy">
                <span>Total:</span>
                <span className="text-den-red">{getTotal()} EGP</span>
              </div>
            </div>

            {/* Delivery Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                Delivery Details
              </h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Doctor Full Name
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
                    placeholder="Dr. Ibrahim"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
                    placeholder="+201234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Exact Delivery Address
                  </label>
                  <textarea
                    required
                    name="address"
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
                    rows="3"
                    placeholder="Street, Building No, Clinic Name, City..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-den-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending Order... ⏳" : "Confirm Booking ✅"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart