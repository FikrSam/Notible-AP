// @/hooks/useUser.ts

import { useEffect, useState } from "react";
import type { User } from "@/types";
import { getUsername } from "@/lib/api";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getUsername()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to load user:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
