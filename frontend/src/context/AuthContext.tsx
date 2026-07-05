/**
 * Authentication context for the AI Producer Assistant frontend.
 *
 * This context manages:
 * - JWT authentication state
 * - Current authenticated user information
 * - Login and logout functionality
 * - Session persistence across page refreshes
 */

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
  // Restore the user's token when the application loads.
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Prevent the application from rendering protected content until
  // authentication status has been determined.
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setCurrentUser(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        // Validate the stored token and load the current user.
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        // Remove invalid or expired tokens and reset auth state.
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
    /**
     * Persist the token locally so the user remains logged in
     * after refreshing the page.
     */
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    /**
     * Clear authentication data and return the application
     * to an unauthenticated state.
     */
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

/**
 * Custom hook for accessing authentication state and actions.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}