import * as React from "react"
import {
  NotepadText,
  Plus,
} from "lucide-react"
import { IconLetterN } from "@tabler/icons-react"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import type { Note } from "@/types/db"
import { useUser } from "@/hooks/useUser"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  notes: Note[]
  onAddNote: () => void
  onSelectNote: (id: number) => void
}

export function AppSidebar({ notes, onAddNote, onSelectNote, ...props }: AppSidebarProps) {
  const { user } = useUser(1)

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
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Notible</span>
                  <span className="truncate text-xs">Where you can write racist stuff</span>
                </div>
              </a>
            </SidebarMenuButton>
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
          projects={notes.map((note) => ({
            name: note.title,
            url: "#",
            icon: NotepadText,
            tags: note.tags?.split(",").map(tag => tag.trim()) ?? [],
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
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
