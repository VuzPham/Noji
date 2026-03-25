import type { signIn, signUp } from "./auth";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  signUp: (signUp: signUp) => Promise<void>;
  signIn: (signIn: signIn) => Promise<void>;
}
