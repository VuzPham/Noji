import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/service/rest/authService";
import type { signIn, signUp } from "@/types/auth";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  clearState: () => set({ accessToken: null, user: null, loading: false }),
  signUp: async (signUp: signUp) => {
    try {
      set({ loading: true });
      // Call api
      await authService.signUp(signUp);
      toast.success("Sign-up successful! Please sign in to continue.");
    } catch (error) {
      console.error("Sign-up error:", error);
      toast.error("Failed to sign up. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (signIn: signIn) => {
    try {
      set({ loading: true });
      // Call API
      const { accessToken } = await authService.signIn(signIn);
      get().setAccessToken(accessToken);
      await get().fetchMe();
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      get().clearState();
      // Call API
      await authService.signOut();
      toast.success("Signed out successfully.");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  },
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error("Fetch me error:", error);
      toast.error("Failed to fetch user info. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
  refreshToken: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe } = get();
      const accessToken = await authService.refreshToken();
      get().setAccessToken(accessToken);
      // when  we should try to fetch user info again
      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      toast.error("Failed to refresh token. Please sign in again.");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
