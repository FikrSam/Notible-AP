// @/hooks/useAuth.ts

import { useEffect, useState } from "react";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { authenticated };
}