"use client"

import {
  type LucideIcon,
} from "lucide-react"
import type { MouseEventHandler } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    onClick: MouseEventHandler<HTMLButtonElement> | undefined
    tags: string[]
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Notes</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton onClick={project.onClick} asChild>
              <a href={project.url} className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2">
                  <project.icon className="size-4" />
                  <span className="text-sm font-medium">{project.name}</span>
                </div>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-6 mt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
