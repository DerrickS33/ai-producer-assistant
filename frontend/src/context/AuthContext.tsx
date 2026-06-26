import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";

type CurrentUser = {
  id: number;
  email: string;
};

type AuthContextType = {
  token: string | null;
  currentUser: CurrentUser | null;
  isAuthLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setCurrentUser(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    loadUser();
  }, [token]);

  function login(newToken: string) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}