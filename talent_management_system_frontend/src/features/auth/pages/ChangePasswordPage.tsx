import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPortal } from "react-dom"
import { authService } from "../services/authService"
import type { ChangePasswordFormData } from "../types/auth.types"
import { changePasswordSchema } from "../utils/authValidators"

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  if (!open) return null

  const toggleShowPassword = (field: "old" | "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      await authService.changePassword(data)
      setSuccess("Password changed successfully")
      reset()

      setTimeout(() => {
        onClose()
        setSuccess(null)
      }, 1500)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to change password"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    setSuccess(null)
    onClose()
  }

  if (!open) return null

return createPortal(
  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md">

    {/* overlay click */}
    <div
      className="absolute inset-0"
      onClick={handleClose}
    />

    {/* center wrapper */}
    <div className="flex min-h-screen items-center justify-center p-4">

      {/* modal */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logotranspaert.webp"
              alt="SWAFRI Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center">
            <span className="text-[#4ade7f]">SWAFRI</span> Change Password
          </h1>

          <p className="text-center text-slate-400 text-sm mt-2 mb-6">
            Update your password to keep your account secure
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Old Password */}
            <div className="relative">
              <input
                {...register("oldPassword")}
                type={showPasswords.old ? "text" : "password"}
                placeholder="Old Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                {...register("newPassword")}
                type={showPasswords.new ? "text" : "password"}
                placeholder="New Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ade7f] hover:bg-[#3bd171] text-black rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Change Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>,
  document.body
)
}