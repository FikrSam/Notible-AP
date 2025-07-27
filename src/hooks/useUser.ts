// @/hooks/useUser.ts

import { useEffect, useState } from "react";
import type { User } from "@/types";
import { getUsername } from "@/lib/api";

export function useUser(userId: number | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getUsername()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to load user:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return { user, loading };
}