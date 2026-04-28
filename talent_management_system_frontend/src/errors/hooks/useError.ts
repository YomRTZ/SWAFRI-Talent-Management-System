import { getError } from "../services/error.service";

export const useError = () => {
  const parseError = (error: unknown) => {
    return getError(error);
  };

  return { parseError };
};