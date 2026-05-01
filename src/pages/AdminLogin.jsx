import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === "rooted") {
      navigate("/admin/dashboard")
    } else {
      setError("Incorrect Password!")
    }
  }

  return (
    <div className="min-h-screen bg-den-navy flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-den-navy">DEN TRUST</h1>
          <p className="text-xs text-gray-500">ADMIN ACCESS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-den-red text-white py-2 rounded font-bold hover:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin