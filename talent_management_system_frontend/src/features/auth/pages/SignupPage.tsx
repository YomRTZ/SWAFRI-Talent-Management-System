import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { signupSchema } from "../utils/authValidators"
import type { AuthModalOption, SignupFormData } from "../types/auth.types"
import { useAuthContext } from '../hooks/useAuth';

type Props = {
  setOpenModal?: (value: AuthModalOption | null) => void;
};

export default function SignUpPage({ setOpenModal }: Props) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signup } = useAuthContext()

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)

    try {
      await signup(data)
      setOpenModal?.(null)
      setOpenModal?.("login")
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
        <span className="text-[#4ade7f]">SWAFRI</span> Sign Up
      </h1>

      <p className="text-center text-slate-400 text-sm mt-2 mb-6">
        Create your account and join the platform
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

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
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phoneNumber")}
            placeholder="Phone Number"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
          />
          {errors.phoneNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ade7f] hover:bg-[#3bd171] text-black rounded-lg font-medium transition"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Create Account"
          )}
        </button>

      </form>

      {/* LOGIN SWITCH */}
      <p className="text-center text-sm text-slate-400 mt-6">
        If you already have an account?{" "}
        <button
          onClick={() => setOpenModal?.("login")}
          className="text-[#4ade7f] hover:underline font-medium"
        >
          Login
        </button>
      </p>

    </div>
  )
}