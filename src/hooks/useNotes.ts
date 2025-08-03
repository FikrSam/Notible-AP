// @/hooks/useNotes.ts

import type { Note } from "@/types/db";
import { fetchNotes } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const useNotes = (userId: number | null) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshNotes = useCallback(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchNotes()
      .then((response) => {
        if (response.data.status === "success") {
          // This is the key change: we access the notes from the nested `data` key.
          setNotes(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || "Failed to fetch notes.");
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setError("An error occurred while fetching notes.");
        }
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  return { notes, loading, error, refreshNotes };
};
