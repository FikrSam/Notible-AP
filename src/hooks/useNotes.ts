// @/hooks/useNotes.ts

import { useEffect, useState } from "react";
import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/db";

const SAMPLE_NOTES: Note[] = [
  {
    id: -1,
    user_id: 0,
    title: "Welcome to Notable!",
    content: "This is a sample note. You can create your own notes using the 'Add' button.",
    tags: "demo,getting started",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: -2,
    user_id: 0,
    title: "Tips & Tricks",
    content: "- Use **markdown**\n- Press Enter for lists\n- Add tags to organize your notes",
    tags: "demo,tips",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useNotes(userId: number | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotes(SAMPLE_NOTES);
      setLoading(false);
      return;
    }

    fetchNotes()
      .then((res) => {
        if (res.status === "success") {
          const data = res.data;
          if (data.length === 0) {
            setNotes(SAMPLE_NOTES); // fallback
          } else {
            setNotes(data);
          }
        } else {
          console.error(res.message);
          setNotes(SAMPLE_NOTES); // fallback on error
        }
      })
      .catch((err) => {
        console.error(err);
        setNotes(SAMPLE_NOTES); // fallback on failure
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { notes, loading };
}
