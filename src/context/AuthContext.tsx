import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { clearAuthToken, validateSession } from "@/services/auth";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await validateSession();
        if (!isMounted) return;

        if (response.success && response.user) {
          setUser(response.user);
        } else {
          clearAuthToken();
          setUser(null);
        }
      } catch {
        if (!isMounted) return;
        clearAuthToken();
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
