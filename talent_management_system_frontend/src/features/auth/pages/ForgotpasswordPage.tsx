import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { forgotPasswordSchema } from "../utils/authValidators"
import type { ForgotPasswordFormData, AuthModalOption } from "../types/auth.types"

type Props = {
  setOpenModal?: (value: AuthModalOption | null) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ForgotPasswordPage(_props: Props) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)

    try {
      console.log("Forgot password:", data)

      await new Promise((r) => setTimeout(r, 1000))

      setSent(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">

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
        <span className="text-[#4ade7f]">SWAFRI</span> forgot Password
      </h1>

      <p className="text-center text-slate-400 text-sm mt-2 mb-6">
        Enter your email to receive reset link
      </p>

      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:border-[#4ade7f] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ade7f] hover:bg-[#3bd171] text-black rounded-lg font-medium transition"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Send Reset Link"
            )}
          </button>

        </form>
      ) : (
        <div className="text-center mt-6">
          <p className="text-green-400 text-sm font-medium">
            Reset link sent! Check your email inbox.
          </p>

          <button
            onClick={() => setSent(false)}
            className="mt-4 text-sm text-[#4ade7f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

    </div>
  )
}