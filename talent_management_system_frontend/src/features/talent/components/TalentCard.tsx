import { Pencil, Trash2 } from "lucide-react";
import type { Talent } from "../types/talent.types";

type Props = {
  data: Talent;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isAdminView?: boolean;
};

export default function TalentCard({ data, onEdit, onDelete, onView, isAdminView = false }: Props) {
  const avatarLetter = data.fullName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div
      className={`w-full bg-surface text-white p-6 rounded-3xl border border-white/10 shadow-sm shadow-black/20 ${isAdminView ? 'cursor-pointer hover:bg-white/10 transition' : ''}`}
      onClick={isAdminView ? onView : undefined}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-semibold text-white shadow-md shadow-emerald-500/20">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-white truncate">{data.fullName}</h2>
              <p className="mt-1 text-sm text-slate-400 truncate">{data.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                {data.experience ? `${data.experience} year${data.experience === 1 ? '' : 's'}` : 'Experience not set'}
              </p>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit();
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-100 transition hover:bg-white/10"
                  aria-label="Edit profile"
                >
                  <Pencil size={16} />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                  aria-label="Delete profile"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Experience</p>
          <p className="mt-2 text-base font-semibold text-white">{data.experience ? `${data.experience} year${data.experience === 1 ? '' : 's'}` : 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
