import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

const CLOUD_NAME = "dz6jt0741"
const UPLOAD_PRESET = "dentrust_products"

const OfferModal = ({ offer, onClose, onSave }) => {
  const [title, setTitle] = useState(offer?.title || "")
  const [category, setCategory] = useState(offer?.category || "")
  const [description, setDescription] = useState(offer?.description || "")
  const [price, setPrice] = useState(offer?.price || 0)
  const [imageUrl, setImageUrl] = useState(offer?.imageUrl || "")
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", UPLOAD_PRESET)
    setUploading(true)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    )
    const data = await response.json()
    setImageUrl(data.secure_url)
    setUploading(false)
  }

  const handleSave = () => {
    if (!title || !category || !description || !price) {
      alert("Please fill in all required fields!")
      return
    }
    onSave({
      id: offer?.id,
      title,
      category,
      description,
      price: Number(price),
      imageUrl,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-den-navy mb-6">
          {offer ? "✏️ Edit Offer" : "➕ Add New Offer"}
        </h2>

        <div className="space-y-4">

          {/* Title / Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Name *
            </label>
            <input
              placeholder="e.g. Summer Sale"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              placeholder="e.g. Composites, Instruments, Bundles..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              placeholder="Describe the offer in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
              rows="3"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Price (EGP) *
            </label>
            <input
              type="number"
              placeholder="e.g. 299"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-den-navy"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Image
            </label>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-40 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center mb-2 border-2 border-dashed border-gray-300">
                <span className="text-gray-400">No image selected</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-den-navy file:text-white hover:file:bg-den-red"
            />

            {uploading && (
              <p className="text-blue-500 text-sm mt-1">
                Uploading image to Cloudinary... ⏳
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
          <button
            disabled={uploading}
            onClick={handleSave}
            className="px-6 py-2 bg-den-red text-white rounded hover:bg-red-700 font-bold disabled:opacity-50"
          >
            {uploading ? "Uploading... ⏳" : "Save Offer ✅"}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)

  const fetchOffers = async () => {
    const snapshot = await getDocs(collection(db, "offers"))
    setOffers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    setLoading(false)
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleSaveOffer = async (offerData) => {
    if (offerData.id) {
      await updateDoc(doc(db, "offers", offerData.id), offerData)
    } else {
      await addDoc(collection(db, "offers"), offerData)
    }
    setIsModalOpen(false)
    setEditingOffer(null)
    fetchOffers()
  }

  const handleDeleteOffer = async (id) => {
    if (window.confirm("Delete this offer?")) {
      await deleteDoc(doc(db, "offers", id))
      fetchOffers()
    }
  }

  if (loading)
    return <p className="p-10 text-center text-gray-500">Loading offers...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-den-navy">Manage Offers</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create and manage special offers for doctors
            </p>
          </div>
          <button
            onClick={() => {
              setEditingOffer(null)
              setIsModalOpen(true)
            }}
            className="bg-den-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            + Add New Offer
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <OfferModal
            offer={editingOffer}
            onClose={() => {
              setIsModalOpen(false)
              setEditingOffer(null)
            }}
            onSave={handleSaveOffer}
          />
        )}

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-xl mb-4">No offers yet.</p>
            <p className="text-gray-400">
              Click "+ Add New Offer" to create one.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full text-left">
              <thead className="bg-den-navy text-white">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b hover:bg-gray-50">

                    {/* Image */}
                    <td className="p-4">
                      {offer.imageUrl ? (
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">No img</span>
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-4 font-semibold text-den-navy">
                      {offer.title}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="bg-den-light-blue text-den-navy px-2 py-1 rounded-full text-xs font-medium">
                        {offer.category}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="p-4 text-gray-500 text-sm max-w-xs truncate">
                      {offer.description}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-den-red">
                      {offer.price} EGP
                    </td>

                    {/* Actions */}
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => {
                          setEditingOffer(offer)
                          setIsModalOpen(true)
                        }}
                        className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOffers