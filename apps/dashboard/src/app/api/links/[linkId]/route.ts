import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
   req: Request,
   { params }: { params: { linkId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { data } = await req.json()

      const { teamId, projectId } = data

      // Verify that the user is part of the team
      const membership = await prisma.membership.findUnique({
         where: {
            userId_teamId: {
               userId,
               teamId,
            },
         },
      })

      if (!membership) {
         return new NextResponse('Forbidden: Not a member of the team', {
            status: 403,
         })
      }

      // Verify that the project belongs to the team
      const project = await prisma.project.findUnique({
         where: {
            id: projectId,
         },
         include: {
            team: true,
         },
      })

      if (!project || project.teamId !== teamId) {
         return new NextResponse('Invalid project for the selected team', {
            status: 400,
         })
      }

      // Update the link
      const link = await prisma.link.update({
         where: { id: params.linkId },
         data: {
            ...data,
            userId,
            teamId,
            projectId,
         },
      })

      return NextResponse.json({ link })
   } catch (error) {
      console.error('[LINKS_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(
   req: Request,
   { params }: { params: { linkId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const link = await prisma.link.findUnique({
         where: {
            id: params.linkId,
         },
         include: {
            project: true,
         },
      })

      if (!link) {
         return new NextResponse('Link not found', { status: 404 })
      }

      return NextResponse.json({ link })
   } catch (error) {
      console.error('[LINKS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
