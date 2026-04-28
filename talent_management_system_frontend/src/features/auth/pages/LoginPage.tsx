import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { loginSchema } from "../utils/authValidators"
import type { AuthModalOption, LoginFormData } from "../types/auth.types"
import { useAuthContext } from '../hooks/useAuth';

type Props = {
  setOpenModal?: (value: AuthModalOption | null) => void;
};

export default function LoginPage({ setOpenModal }: Props) {
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthContext()

  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      await login({ ...data, rememberMe })
      setOpenModal?.(null)
      navigate("/")
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

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
        <span className="text-[#4ade7f]">SWAFRI</span> Login
      </h1>

      <p className="text-center text-slate-400 text-sm mt-2 mb-6">
        Welcome back — manage your talent efficiently
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Email */}
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
        />

        {/* Password */}
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>


        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-xs text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="mr-2 accent-[#4ade7f]"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => setOpenModal?.("forgot")}
            className="text-xs text-slate-400 hover:text-[#4ade7f] transition"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ade7f] hover:bg-[#3bd171] text-black rounded-lg font-medium transition"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Login"
          )}
        </button>

      </form>

      {/* 🔗 Sign Up Section */}
      <p className="text-center text-sm text-slate-400 mt-6">
        Don’t have an account?{" "}
        <button
          onClick={() => setOpenModal?.("signup")}
          className="text-[#4ade7f] hover:underline font-medium"
        >
          Sign up
        </button>
      </p>

    </div>
  )
}