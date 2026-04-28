import { useToast } from "./hooks/useToast";
import type { Toast as ToastType } from "./type/toast.type";

type ToastProps = {
  toast: ToastType;
};

function Toast({ toast }: ToastProps) {
  const { removeToast } = useToast();

  const typeStyles: Record<string, string> = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`p-4 rounded-md shadow-lg max-w-sm mb-2 ${
        typeStyles[toast.type] || typeStyles.info
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm mt-1">{toast.description}</p>
          )}
        </div>

        <button
          onClick={() => removeToast(toast.id)}
          className="ml-4 text-xl leading-none hover:opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}