import type { signIn, signUp } from "./auth";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;
  signUp: (signUp: signUp) => Promise<void>;
  signIn: (signIn: signIn) => Promise<void>;
  signOut: () => Promise<void>;
}
