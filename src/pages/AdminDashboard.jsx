import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { Link } from "react-router-dom"

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"))
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setOrders(ordersList)
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const updateStatus = async (id, newStatus) => {
    const orderRef = doc(db, "orders", id)
    await updateDoc(orderRef, { status: newStatus })
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    ))
  }

  const getStatusColor = (status) => {
    if (status === "delivered") return "bg-green-200 text-green-800"
    if (status === "confirmed") return "bg-blue-200 text-blue-800"
    return "bg-yellow-200 text-yellow-800"
  }

  if (loading) return <p className="p-10 text-center">Loading orders...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-den-navy mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all orders, products and offers
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/admin/products"
            className="bg-den-navy text-white px-6 py-3 rounded-lg font-bold hover:bg-den-red transition"
          >
            🛠️ Manage Products
          </Link>
          <Link
            to="/admin/offers"
            className="bg-den-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            🔥 Manage Offers
          </Link>
        </div>

        {/* Orders Table */}
        <h2 className="text-2xl font-bold text-den-navy mb-4">
          📋 Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-xl mb-4">No orders yet.</p>
            <p className="text-gray-400">
              Orders will appear here when doctors book products.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-den-navy text-white">
                  <tr>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-bold text-den-navy">
                        {order.doctorName}
                      </td>
                      <td className="p-4">{order.phone}</td>
                      <td className="p-4 text-sm italic max-w-xs">
                        {order.address}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {order.items.map((item, i) => (
                          <div key={i}>
                            • {item.name}{" "}
                            <span className="text-gray-400">
                              (x{item.qty})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-den-red">
                        {order.items.reduce(
                          (sum, item) => sum + item.price * item.qty,
                          0
                        )}{" "}
                        EGP
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-den-navy"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="delivered">📦 Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard