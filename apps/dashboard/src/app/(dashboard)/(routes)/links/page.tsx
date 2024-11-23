import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { formatter } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import FilterableTeamLinks from './components/filterable-team-links'
import { TeamLinks } from './components/team-links'

export default async function ProductsPage() {
   const teams = await prisma.team.findMany({
      include: {
         projects: {
            include: {
               links: {
                  select: {
                     id: true,
                     title: true,
                     shortenedUrl: true,
                     createdAt: true,
                     _count: {
                        select: { clicks: true },
                     },
                  },
               },
            },
         },
      },
      orderBy: {
         createdAt: 'desc',
      },
   })

   const teamsWithClickCount = teams.map((team) => ({
      ...team,
      projects: team.projects.map((project) => ({
         ...project,
         links: project.links.map((link) => ({
            ...link,
            clicks: link._count.clicks,
         })),
      })),
   }))

   return (
      <div className="container mx-auto py-10">
         <h1 className="text-4xl font-bold mb-10">Link Tracking Dashboard</h1>
         <FilterableTeamLinks teams={teamsWithClickCount} />
      </div>
   )
}
