import { Trash2, X } from "lucide-react";
import type { Talent } from "../types/talent.types";

type Props = {
  talent: Talent | null;
  onClose: () => void;
  onDelete?: () => void;
};

export default function TalentDetailModal({ talent, onClose, onDelete }: Props) {
  if (!talent) return null;

  const avatarLetter = talent.fullName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="fixed inset-0 bg-fg flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-white/10 shadow-lg shadow-black/20">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Talent Profile</h2>
            <p className="text-sm text-slate-400 mt-1">View the selected talent details.</p>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-100 transition hover:bg-white/10"
              aria-label="Close details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Header with Avatar */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white/5 p-5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white shadow-lg shadow-green-500/20">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold text-white leading-tight truncate">{talent.fullName}</h3>
                <p className="mt-1 text-sm text-slate-300 truncate">{talent.email}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">This profile contains the talent's primary skill, experience, and a short personal description.</p>
          </div>

          {/* Profile Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Primary skill</p>
              <p className="mt-3 text-lg font-semibold text-white">{talent.primarySkill || 'Not specified'}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Experience</p>
              <p className="mt-3 text-lg font-semibold text-white">{talent.experience ? `${talent.experience} years` : 'Not specified'}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-5 border border-white/10">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Description</p>
            <p className="mt-3 text-base leading-7 text-slate-200">{talent.description || 'No description provided'}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}