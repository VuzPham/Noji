import type { signIn, signUp } from "@/types/auth";
import api from "@/lib/axios";

export const authService = {
  signUp: async (signUp: signUp) => {
    try {
      const response = await api.post("/auth/signup", signUp);
      return response.data;
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  },
  signIn: async (signIn: signIn) => {
    try {
      const response = await api.post("/auth/signin", signIn);
      return response.data;
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  },
};
