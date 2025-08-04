// @/hooks/useAuth.ts

import { useEffect, useState } from "react";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthenticated(!!localStorage.getItem("token"));

      const handleStorageChange = () => {
        setAuthenticated(!!localStorage.getItem("token"));
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  return { authenticated };
}
