import { getError } from "../services/error.service";
import type { Toast } from "../../components/common/toast/type/toast.type"

type HandleErrorOptions = {
  addToast?: (toast: {
    title: string;
    description?: string;
    type: Toast['type'];
  }) => void;
  setError?: (msg: string) => void;
};

export function getUserSafeErrorMessage(error: unknown) {
  const parsed = getError(error);
  return {
    title: parsed.title,
    description: parsed.description,
  };
}

export function handleError(error: unknown, options: HandleErrorOptions) {
  const parsed = getError(error);

  if (options.addToast) {
    options.addToast({
      title: parsed.title,
      description: parsed.description,
      type: 'error',
    });
  }

  if (options.setError) {
    options.setError(parsed.title);
  }

  throw error; 
}