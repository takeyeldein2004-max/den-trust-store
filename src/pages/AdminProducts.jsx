import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"

const ProductModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product?.name || "")
  const [category, setCategory] = useState(product?.category || "")
  const [price, setPrice] = useState(product?.price || 0)
  const [description, setDescription] = useState(product?.description || "")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-den-navy mb-6">
          {product ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price (EGP)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {imagePreview && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Image Preview</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                id: product?.id,
                name,
                category,
                price: Number(price),
                description,
                imageFile,
                imageUrl: product?.imageUrl || "",
              })
            }
            className="px-6 py-2 bg-den-red text-white rounded hover:bg-red-700 font-bold"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"))
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setProducts(productsList)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are missing.")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to upload image to Cloudinary.")
    }

    return data.secure_url
  }

  const handleSaveProduct = async (productData) => {
    try {
      let finalImageUrl = productData.imageUrl || ""

      if (productData.imageFile) {
        finalImageUrl = await uploadImageToCloudinary(productData.imageFile)
      }

      const productToSave = {
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        description: productData.description,
        imageUrl: finalImageUrl,
      }

      if (productData.id) {
        await updateDoc(doc(db, "products", productData.id), productToSave)
      } else {
        await addDoc(collection(db, "products"), productToSave)
      }

      setIsModalOpen(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error("Error saving product:", error)
      alert(error.message || "Failed to save product.")
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id))
      fetchProducts()
    }
  }

  if (loading)
    return <p className="p-10 text-center text-gray-500">Loading products...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-den-navy">Product Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              Add, edit or delete products. Changes appear instantly on the site.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null)
              setIsModalOpen(true)
            }}
            className="bg-den-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            + Add New Product
          </button>
        </div>

        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            onClose={() => {
              setIsModalOpen(false)
              setEditingProduct(null)
            }}
            onSave={handleSaveProduct}
          />
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-xl mb-4">No products yet.</p>
            <p className="text-gray-400">Click "+ Add New Product" to get started.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full text-left">
              <thead className="bg-den-navy text-white">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-den-navy">{product.name}</td>
                    <td className="p-4 text-gray-600">{product.category}</td>
                    <td className="p-4 font-bold text-den-red">{product.price} EGP</td>
                    <td className="p-4 text-gray-500 text-sm max-w-xs truncate">
                      {product.description || "No description"}
                    </td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setIsModalOpen(true)
                        }}
                        className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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

export default AdminProducts