// hooks/useAuthHeaders.ts
import { useAppSelector } from "../store/store";

export const useAuthHeaders = () => {
  const token = useAppSelector((state) => state.auth.token);

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// // Usage in components
// const headers = useAuthHeaders();
// fetch("/api/protected-route", headers);
