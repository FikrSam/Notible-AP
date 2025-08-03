// @/hooks/useUser.ts

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
  username: string;
  email: string;
  exp: number;
}

interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired. Logging out.");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({
            id: decoded.user_id,
            username: decoded.username,
            email: decoded.email,
          });
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
