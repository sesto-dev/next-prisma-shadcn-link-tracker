import prisma from '@/lib/prisma'

import { LinkForm } from './components/link-form'

export default async function LinkPage({
   params,
}: {
   params: { linkId: string }
}) {
   const product = await prisma.link.findUnique({
      where: {
         id: params.linkId,
      },
   })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <LinkForm initialData={product} />
         </div>
      </div>
   )
}
