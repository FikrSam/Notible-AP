// @/hooks/useUser.ts

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  username: string;
  email?: string; // email might not be in the token, so we make it optional
}

interface DecodedToken {
  user_id: number;
  username: string;
  exp: number; // Expiration timestamp
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check if the token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired. Logging out.");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({
            id: decoded.user_id,
            username: decoded.username,
          });
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
        localStorage.removeItem("token"); // Remove invalid token
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
