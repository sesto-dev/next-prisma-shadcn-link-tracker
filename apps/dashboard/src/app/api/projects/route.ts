import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const memberships = await prisma.membership.findMany({
         where: {
            userId,
         },
      })

      const projects = await prisma.project.findMany({
         where: {
            teamId: {
               in: memberships.map((m) => m.teamId),
            },
         },
      })

      return NextResponse.json({ projects })
   } catch (error) {
      console.error('[PROJECTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
