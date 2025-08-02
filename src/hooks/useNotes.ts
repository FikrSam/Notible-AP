// @/hooks/useNotes.ts

import type { Note } from "@/types";
import { getNotes } from "@/lib/api";
import { useEffect, useState } from "react";

export function useNotes(userId: number | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getNotes()
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => {
        console.error("Failed to load notes:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return { notes, loading };
}