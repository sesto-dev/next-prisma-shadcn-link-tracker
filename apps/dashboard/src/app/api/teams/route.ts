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

      const teams = await prisma.team.findMany({
         where: {
            id: {
               in: memberships.map((m) => m.teamId),
            },
         },
      })

      return NextResponse.json({ memberships, teams })
   } catch (error) {
      console.error('[TEAMS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
