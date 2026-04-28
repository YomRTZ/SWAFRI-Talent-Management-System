import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuthContext } from '../hooks/useAuth';

export default function LogoutPage() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { logout } = useAuthContext()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        navigate("/sign-in")
      } catch (err) {
        console.error(err)
        navigate("/sign-in")
      } finally {
        setLoading(false)
      }
    }

    performLogout()
  }, [logout, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <div className="text-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-white">
          Logging out...
        </h1>

        <p className="text-slate-400 text-sm mt-2 mb-6">
          Please wait while we securely sign you out
        </p>

        <div className="flex justify-center">
          {loading && (
            <Loader2 className="animate-spin text-[#4ade7f] w-6 h-6" />
          )}
        </div>

      </div>
    </div>
  )
}