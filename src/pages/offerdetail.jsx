import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { useCart } from "../context/CartContext"

function OfferDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [offer, setOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchOffer = async () => {
      const docRef = doc(db, "offers", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setOffer({ id: docSnap.id, ...docSnap.data() })
      }
      setLoading(false)
    }
    fetchOffer()
  }, [id])

  const handleAddToCart = () => {
    addToCart(
      {
        id: offer.id,
        name: offer.title,
        price: offer.price,
        category: offer.category,
        imageUrl: offer.imageUrl,
      },
      1
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading offer...</p>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Offer not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link
          to="/offers"
          className="inline-block mb-8 text-den-navy hover:text-den-red font-medium"
        >
          ← Back to All Offers
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* LEFT: Offer Image */}
            <div className="bg-gray-100 flex items-center justify-center p-8">
              {offer.imageUrl ? (
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image Available</span>
                </div>
              )}
            </div>

            {/* RIGHT: Offer Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <span className="inline-block bg-den-light-blue text-den-navy text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {offer.category}
                </span>

                {/* Offer Name */}
                <h1 className="text-3xl font-bold text-den-navy mb-4">
                  {offer.title}
                </h1>

                {/* Price */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Offer Price</p>
                  <p className="text-4xl font-bold text-den-red">
                    {offer.price} EGP
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-den-navy mb-2">
                    Offer Details
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {offer.description ||
                      "This is an exclusive offer. Contact us for more details."}
                  </p>
                </div>
              </div>

              {/* Add to Cart */}
              <div>
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-den-navy text-white hover:bg-den-red"
                  }`}
                >
                  {added ? "✅ Added to Cart!" : "Add This Offer to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferDetail