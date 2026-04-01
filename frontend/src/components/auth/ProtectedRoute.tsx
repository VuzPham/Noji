import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, loading, refreshToken, fetchMe } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        await refreshToken();
      }
      const { accessToken: latestToken, user: latestUser } =
        useAuthStore.getState();

      if (latestToken && !latestUser) {
        await fetchMe();
      }
      setInitializing(false);
    };
    init();
  }, [accessToken, refreshToken, fetchMe]);

  if (loading || initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
