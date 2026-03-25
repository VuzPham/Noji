import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000, // 3s
      refetchOnWindowFocus: false,
    },
  },
});
