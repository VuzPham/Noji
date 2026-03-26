import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

export default function Logout() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return <Button onClick={handleSignOut}>Logout</Button>;
}
