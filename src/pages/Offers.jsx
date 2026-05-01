import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, getDocs } from "firebase/firestore"
import { Link } from "react-router-dom"

function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      const snapshot = await getDocs(collection(db, "offers"))
      setOffers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    }
    fetchOffers()
  }, [])

  if (loading)
    return <p className="p-10 text-center text-gray-500">Loading offers...</p>

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-den-navy">🔥 Special Offers</h1>
        </div>
        {offers.length === 0 ? (
          <p className="text-center text-gray-500">No offers found.</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <Link
                to={`/offer/${offer.id}`} // This is the link that will now work
                key={offer.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className="h-48 bg-gray-200">
                  {offer.imageUrl ? (
                    <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-den-navy group-hover:text-den-red">{offer.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Offers