import type { ReactNode } from "react";

import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

/**
 * Route guard for authenticated pages.
 *
 * This component prevents protected application content from rendering
 * until the user's authentication state has been checked.
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isAuthLoading, login } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b14] text-white">
        <p className="text-slate-400">Loading...</p>
      </main>
    );
  }

  if (!token) {
    return <AuthForm onAuthSuccess={login} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;