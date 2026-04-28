import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { talentService } from "../services/talentService"
import type { Talent } from "../types/talent.types"

export default function TalentDetailPage() {
  const { id } = useParams()
  const [talent, setTalent] = useState<Talent | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }
    const fetchTalent = async () => {
      setLoading(true)
      try {
        const data = await talentService.getById(id)
        setTalent(data)
        setError(null)
      } catch (e: unknown) {
        const err = e as Error
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchTalent()
  }, [id])

  if (loading) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-sm text-slate-300">Check the profile ID or try again.</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold">Profile not found</p>
        </div>
      </div>
    )
  }

  const avatarLetter = talent.fullName?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-bg text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl bg-surface border border-white/10 rounded-4xl p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-28 h-28 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 text-4xl font-bold text-white shadow-lg shadow-emerald-500/25">
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">{talent.fullName}</h1>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">Talent profile</p>
            <p className="mt-3 text-sm text-slate-300">{talent.email}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-bg p-5 border border-white/10">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Primary skill</p>
            <p className="mt-3 text-xl font-semibold text-white leading-snug">{talent.primarySkill || 'Not specified'}</p>
          </div>
          <div className="rounded-3xl bg-bg p-5 border border-white/10">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Experience</p>
            <p className="mt-3 text-xl font-semibold text-white leading-snug">{talent.experience ?? 'N/A'} years</p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] bg-bg p-6 border border-white/10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">About</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Profile description</span>
          </div>
          <p className="text-base leading-7 text-slate-200 whitespace-pre-wrap">{talent.description || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  )
}