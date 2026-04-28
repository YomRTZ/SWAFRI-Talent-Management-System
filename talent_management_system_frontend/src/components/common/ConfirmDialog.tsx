
type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Yes",
  cancelLabel = "No",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl shadow-black/40">
        {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="w-full sm:w-auto rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
