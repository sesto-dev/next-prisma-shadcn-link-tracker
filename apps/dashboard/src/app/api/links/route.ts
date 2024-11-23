import prisma from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const data = await req.json()
      const { teamId, projectId, ...restData } = data
      const shortId = data.customAlias || nanoid(8)

      // Create the link with proper relation connections
      const link = await prisma.link.create({
         data: {
            ...restData,
            shortenedUrl: shortId,
            user: {
               connect: { id: userId },
            },
            project: {
               connect: { id: projectId },
            },
         },
      })

      return NextResponse.json(link)
   } catch (error) {
      console.error('[LINKS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const links = await prisma.link.findMany({
         where: {
            userId,
         },
         include: {
            project: true,
         },
      })

      return NextResponse.json({ links })
   } catch (error) {
      console.error('[LINKS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
