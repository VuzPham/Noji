import Logout from "@/components/auth/logout";
import { useAuthStore } from "@/stores/useAuthStore";

function ChatAppPage() {
  // s: AuthState
  // only call user
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      {user?.username}
      <Logout />
    </div>
  );
}

export default ChatAppPage;
