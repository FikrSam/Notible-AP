// @/pages/Notebook.tsx

"use client";
import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Note } from "@/types/db";
import { useUser } from "@/hooks/useUser";
import { useNotes } from "@/hooks/useNotes";

export default function Notebook() {
  const { user, loading: userLoading } = useUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { notes: initialNotes, loading: notesLoading } = useNotes(user?.id ?? null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTag, setNewTag] = useState("");

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? notes[0];


  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current && initialNotes.length) {
      setNotes(initialNotes);
      hasInitialized.current = true;
    }
  }, [initialNotes]);

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      user_id: user?.id ?? 1,
      title: "Untitled Note",
      content: "",
      tags: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleAddTag = () => {
    if (!selectedNote || !newTag.trim()) return;

    const currentTags = selectedNote.tags
      ? selectedNote.tags.split(",").map((t) => t.trim())
      : [];

    const newTagTrimmed = newTag.trim();

    if (!currentTags.includes(newTagTrimmed)) {
      const updatedTags = [...currentTags, newTagTrimmed].join(", ");

      const newTitle = selectedNote.title.trim();

      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? {
              ...note,
              tags: updatedTags,
              title: newTitle,
            }
            : note
        )
      );

      setNewTag("");
    }
  };

  const handleDeleteNote = () => {
    if (!selectedNoteId) return;

    setNotes((prev) => prev.filter((note) => note.id !== selectedNoteId));
    setSelectedNoteId(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        notes={notes}
        onAddNote={handleAddNote}
        onSelectNote={(id: number) => setSelectedNoteId(id)} onLogout={function (): void {
          throw new Error("Function not implemented.");
        }} />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Notebook</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedNote?.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex-1 p-4">
            {userLoading || notesLoading ? (
              <div className="text-muted-foreground">Loading note...</div>
            ) : selectedNoteId === null ? (
              // Grid preview before selection
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className="rounded-md border p-4 text-left hover:bg-muted/50 transition"
                  >
                    <h3 className="text-lg font-semibold mb-1 truncate">{note.title || "Untitled"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content?.slice(0, 200) || "No content..."}
                    </p>
                    {note.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (

              <div className="flex flex-col h-full space-y-4">
                <div className="flex gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNoteId(null)}
                    className="self-start text-sm text-muted-foreground hover:underline"
                  >
                    ← Back
                  </Button>

                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="self-start text-sm"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Note</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this note? This action cannot be undone.
                      </p>
                      <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleDeleteNote();
                            setShowDeleteDialog(false);
                          }}
                        >
                          Yes, Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-start justify-between flex-wrap gap-2">
                  {/* Title & Tags */}
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) =>
                        setNotes((prev) =>
                          prev.map((note) =>
                            note.id === selectedNote.id
                              ? { ...note, title: e.target.value }
                              : note
                          )
                        )
                      }
                      className="text-2xl font-bold outline-none border-none bg-transparent"
                    />
                    <div className="flex flex-wrap gap-1">
                      {selectedNote.tags &&
                        selectedNote.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                    </div>
                  </div>

                  {/* Add Tag input and button */}
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      placeholder="New tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="h-8 px-2 text-sm w-32"
                    />
                    <Button size="sm" className="h-8" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                </div>


                <textarea
                  ref={textareaRef}
                  dir="ltr"
                  lang="en"
                  value={selectedNote.content ?? ""}
                  onChange={(e) =>
                    setNotes((prev) =>
                      prev.map((note) =>
                        note.id === selectedNote.id
                          ? { ...note, content: e.target.value }
                          : note
                      )
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "z") {
                      e.preventDefault();
                      document.execCommand("undo");
                    }
                    if (
                      e.ctrlKey &&
                      (e.key === "y" || (e.shiftKey && e.key === "z"))
                    ) {
                      e.preventDefault();
                      document.execCommand("redo");
                    }

                    if (e.key === "Enter") {
                      const value = selectedNote.content ?? "";
                      const lines = value.split("\n");
                      const caretPos = textareaRef.current?.selectionStart ?? 0;
                      const lineIndex = value.substring(0, caretPos).split("\n").length - 1;
                      const currentLine = lines[lineIndex];

                      const match = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
                      if (match) {
                        e.preventDefault();
                        const prefix =
                          match[2].match(/\d+\./) != null
                            ? `${parseInt(match[2]) + 1}. `
                            : `${match[2]} `;

                        const before = value.substring(0, caretPos);
                        const after = value.substring(caretPos);
                        const updated = `${before}\n${prefix}${after}`;

                        setNotes((prev) =>
                          prev.map((note) =>
                            note.id === selectedNote.id
                              ? { ...note, content: updated }
                              : note
                          )
                        );

                        setTimeout(() => {
                          if (textareaRef.current) {
                            const newPos = caretPos + prefix.length + 1;
                            textareaRef.current.selectionStart = newPos;
                            textareaRef.current.selectionEnd = newPos;
                          }
                        }, 0);
                      }
                    }
                  }}
                  className="flex-1 w-full h-full resize-none rounded-md border p-4 text-sm font-mono outline-none text-left"
                  style={{
                    direction: "ltr",
                    unicodeBidi: "plaintext",
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}