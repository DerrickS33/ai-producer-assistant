import type { ReactNode } from "react";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

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