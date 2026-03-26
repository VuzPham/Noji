import type { signIn, signUp } from "@/types/auth";
import api from "@/lib/axios";

export const authService = {
  signUp: async (signUp: signUp) => {
    try {
      const response = await api.post("/auth/signup", signUp, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  },
  signIn: async (signIn: signIn) => {
    try {
      const response = await api.post("/auth/signin", signIn, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await api.post("/auth/signout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  },
};
