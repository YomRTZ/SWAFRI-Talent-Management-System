import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema } from "../utils/authValidators"
import type { ResetPasswordFormData } from "../types/auth.types"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  })
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const toggleShowPassword = (field: "password" | "confirmPassword") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true)

    try {
      console.log("Reset password:", data)

      await new Promise((r) => setTimeout(r, 1000))

      navigate("/sign-in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div >
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
        <span className="text-[#4ade7f]">SWAFRI</span> Reset Password
      </h1>
        <p className="text-center text-slate-400 text-sm mt-2 mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="relative">
            <input
              {...register("password")}
              type={showPasswords.password ? "text" : "password"}
              placeholder="New Password"
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("password")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPasswords.password ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showPasswords.confirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirmPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPasswords.confirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ade7f] hover:bg-[#3bd171] text-black rounded-lg font-medium transition"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Reset Password"}
          </button>

        </form>

     
    </div>
  )
}