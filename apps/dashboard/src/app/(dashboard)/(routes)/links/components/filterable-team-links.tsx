'use client'

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
   Command,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'

import { LinkCard } from './link-card'

interface Team {
   id: string
   title: string
   projects: Project[]
}

interface Project {
   id: string
   title: string
   links: Link[]
}

interface Link {
   id: string
   title: string
   shortenedUrl: string
   clicks: number
   createdAt: Date
}

interface FilterableTeamLinksProps {
   teams: Team[]
}

export default function FilterableTeamLinks({
   teams,
}: FilterableTeamLinksProps) {
   const [selectedTeams, setSelectedTeams] = useState<string[]>([])
   const [selectedProjects, setSelectedProjects] = useState<string[]>([])

   // Gather all unique projects based on selected teams
   const availableProjects = useMemo(() => {
      if (selectedTeams.length === 0) {
         return teams.flatMap((team) => team.projects)
      }
      return teams
         .filter((team) => selectedTeams.includes(team.id))
         .flatMap((team) => team.projects)
   }, [selectedTeams, teams])

   // Filter projects based on selectedTeams and selectedProjects
   const filteredProjects = useMemo(() => {
      let projects = teams.flatMap((team) => team.projects)
      if (selectedTeams.length > 0) {
         projects = projects.filter((project) =>
            selectedTeams.includes(project.id)
         )
      }
      if (selectedProjects.length > 0) {
         projects = projects.filter((project) =>
            selectedProjects.includes(project.id)
         )
      }
      return projects
   }, [teams, selectedTeams, selectedProjects])

   const handleTeamSelect = (teamId: string) => {
      setSelectedTeams((prev) =>
         prev.includes(teamId)
            ? prev.filter((id) => id !== teamId)
            : [...prev, teamId]
      )
   }

   const handleProjectSelect = (projectId: string) => {
      setSelectedProjects((prev) =>
         prev.includes(projectId)
            ? prev.filter((id) => id !== projectId)
            : [...prev, projectId]
      )
   }

   const clearFilters = () => {
      setSelectedTeams([])
      setSelectedProjects([])
   }

   return (
      <div>
         {/* Filters */}
         <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            {/* Team Filter */}
            <div className="flex-1 mb-4 md:mb-0">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Teams
               </label>
               <Command>
                  <Select>
                     <SelectTrigger className="w-full">
                        <SelectValue
                           placeholder={
                              selectedTeams.length > 0
                                 ? `${selectedTeams.length} team(s) selected`
                                 : 'Select teams...'
                           }
                        />
                     </SelectTrigger>
                     <SelectContent>
                        <CommandInput placeholder="Search teams..." />
                        <CommandList>
                           {teams.map((team) => (
                              <CommandItem
                                 key={team.id}
                                 value={team.id}
                                 onSelect={() => handleTeamSelect(team.id)}
                                 className="flex justify-between items-center"
                              >
                                 <span>{team.title}</span>
                                 {selectedTeams.includes(team.id) && (
                                    <Check className="w-4 h-4" />
                                 )}
                              </CommandItem>
                           ))}
                        </CommandList>
                     </SelectContent>
                  </Select>
               </Command>
            </div>

            {/* Project Filter */}
            <div className="flex-1 mb-4 md:mb-0">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Projects
               </label>
               <Command>
                  <Select>
                     <SelectTrigger className="w-full">
                        <SelectValue
                           placeholder={
                              selectedProjects.length > 0
                                 ? `${selectedProjects.length} project(s) selected`
                                 : 'Select projects...'
                           }
                        />
                     </SelectTrigger>
                     <SelectContent>
                        <CommandInput placeholder="Search projects..." />
                        <CommandList>
                           {availableProjects.map((project) => (
                              <CommandItem
                                 key={project.id}
                                 value={project.id}
                                 onSelect={() =>
                                    handleProjectSelect(project.id)
                                 }
                                 className="flex justify-between items-center"
                              >
                                 <span>{project.title}</span>
                                 {selectedProjects.includes(project.id) && (
                                    <Check className="w-4 h-4" />
                                 )}
                              </CommandItem>
                           ))}
                        </CommandList>
                     </SelectContent>
                  </Select>
               </Command>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
               <button
                  onClick={clearFilters}
                  className="mt-4 md:mt-0 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
               >
                  Clear Filters
               </button>
            </div>
         </div>

         {/* Display Filtered Projects with Accordions */}
         <div className="space-y-4">
            <Accordion type="multiple">
               {filteredProjects.map((project) => (
                  <AccordionItem key={project.id} value={project.id}>
                     <AccordionTrigger>
                        <h2 className="text-lg font-semibold">
                           {project.title}
                        </h2>
                     </AccordionTrigger>
                     <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {project.links.map((link) => (
                              <LinkCard key={link.id} link={link} />
                           ))}
                        </div>
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         </div>
      </div>
   )
}
