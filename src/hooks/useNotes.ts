// @/hooks/useNotes.ts

import { useEffect, useState } from "react";
import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/db";

export function useNotes(userId: number | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchNotes()
      .then((res) => {
        if (res.status === "success") {
          setNotes(res.data);
        } else {
          console.error(res.message);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return { notes, loading };
}
