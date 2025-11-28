"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Define the shape of our Context
type AuthContextType = {
  user: any;
  loading: boolean;
  signInMock: (email: string) => void; // <--- New Helper
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInMock: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Function to fake a login immediately
  const signInMock = (email: string) => {
    // We create a fake user object
    const fakeUser = {
      id: "dev-user-123",
      email: email,
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };
    setUser(fakeUser);
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}