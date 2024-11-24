import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'

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
   clicks: number
   createdAt: Date
}

export function TeamLinks({ team }: { team: Team }) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>{team.title}</CardTitle>
            <CardDescription>Links grouped by projects</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-6">
               {team.projects.map((project) => (
                  <div key={project.id}>
                     <h3 className="text-lg font-semibold mb-2">
                        {project.title}
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.links.map((link) => (
                           <LinkCard key={link.id} link={link} />
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   )
}
