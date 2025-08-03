// @/components/app-sidebar.tsx
import * as React from "react";
import { NotepadText, Plus } from "lucide-react";
import { IconLetterN } from "@tabler/icons-react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user"; // Updated import
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { Note } from "@/types/db";
import { useUser } from "@/hooks/useUser";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  notes: Note[];
  onAddNote: () => void;
  onSelectNote: (id: number) => void;
  onLogout: () => void; // Add this new prop
};

export function AppSidebar({ notes, onAddNote, onSelectNote, onLogout, ...props }: AppSidebarProps) {
  const { user } = useUser();
  const [query, setQuery] = React.useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <IconLetterN className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span>Note Book</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Get Things Done
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <input
              type="text"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button
                onClick={onAddNote}
                className="bg-black text-white justify-center flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
              >
                <Plus className="size-4" />
                <span>Add</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects
          projects={filteredNotes.map((note) => ({
            name: note.title,
            url: "#",
            icon: NotepadText,
            tags: note.tags?.split(",").map((tag) => tag.trim()) ?? [],
            onClick: () => onSelectNote(note.id),
          }))}
        />
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.username,
              email: user.email,
              avatar: "/avatars/shadcn.jpg",
            }}
            onLogout={onLogout} // Pass the logout function here
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
