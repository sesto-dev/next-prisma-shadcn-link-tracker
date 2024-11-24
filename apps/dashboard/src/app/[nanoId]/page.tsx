import prisma from '@/lib/prisma'
import { extractRequestData } from '@/lib/requestData'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import requestIp from 'request-ip'

export default async function ShortLinkRedirect({
   params,
}: {
   params: { nanoId: string }
}) {
   const link = await prisma.link.findFirst({
      where: {
         OR: [{ id: params.nanoId }, { customAlias: params.nanoId }],
      },
   })

   if (!link) {
      return redirect('/')
   }

   const reqHeaders = headers()
   const requestData = extractRequestData(reqHeaders)

   // Fire and forget the click tracking
   Promise.allSettled([
      prisma.click.create({
         data: {
            link: {
               connect: { id: link.id },
            },
            userAgent: reqHeaders.get('user-agent') || '',
            ipAddress:
               reqHeaders.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0',
            deviceType: 'Other',
         },
      }),
   ])
      .then((results) => {
         const [clickResult] = results
         if (clickResult.status === 'fulfilled') {
            console.log('Click created:', clickResult.value)
         } else {
            console.error('Click creation failed:', clickResult.reason)
         }
      })
      .catch(console.error)

   return redirect(link.originalUrl)
}
