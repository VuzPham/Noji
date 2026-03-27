import type { signIn, signUp } from "./auth";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  setAccessToken: (accessToken: string | null) => void;
  clearState: () => void;
  signUp: (signUp: signUp) => Promise<void>;
  signIn: (signIn: signIn) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
