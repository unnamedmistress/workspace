import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading, ready } = useAuth();

  if (!ready) {
    return <Navigate to="/settings" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
