import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // Include cookies in requests
});

// Add a response interceptor to handle 401 errors
api.interceptors.request.use((config) => {
  // get accessToken from auth store when code runs
  // if accessToken in stores refresh then accessToken no change
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// add a response interceptor called api when refrehtolen expired
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // originalRequest is the request that caused the error
    const originalRequest = error.config;
    // If the error is 403 and the request is not for refresh token, sign in or sign up, then try to refresh the token
    if (
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup")
    ) {
      return Promise.reject(error);
    }
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403 && originalRequest._retryCount <= 4) {
      originalRequest._retryCount += 1;
      try {
        const res = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        console.error("Refresh token error:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default api;
