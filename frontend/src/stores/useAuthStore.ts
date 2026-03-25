import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/service/rest/authService";
import type { signIn, signUp } from "@/types/auth";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  loading: false,

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
      await authService.signIn(signIn);
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
}));
