import { verifyJWT } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { LinkForm } from './components/link-form'

export default async function LinkPage({
   params,
}: {
   params: { linkId: string }
}) {
   // Get the token from cookies
   const cookieStore = cookies()
   const token = cookieStore.get('token')

   if (!token) {
      redirect('/login')
   }

   try {
      // Verify the JWT and get the user ID
      const { sub: userId } = await verifyJWT<{ sub: string }>(token.value)

      const link = await prisma.link.findUnique({
         where: {
            id: params.linkId,
         },
         include: {
            project: true,
         },
      })

      // Fetch teams the user is a member of
      const memberships = await prisma.membership.findMany({
         where: { userId },
         include: { team: true },
      })
      const teams = memberships.map((m) => m.team)

      // Fetch all projects associated with the user's teams
      const projects = await prisma.project.findMany({
         where: {
            teamId: { in: teams.map((t) => t.id) },
         },
      })

      return (
         <div className="container mx-auto py-10">
            <div className="flex-1 space-y-4">
               <LinkForm initialData={link} teams={teams} projects={projects} />
            </div>
         </div>
      )
   } catch (error) {
      console.error('[LINK_PAGE]', error)
      redirect('/login')
   }
}
