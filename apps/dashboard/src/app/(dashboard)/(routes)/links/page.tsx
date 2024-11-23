import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { formatter } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { LinksTable } from './components/table'
import { LinkColumn } from './components/table'

export default async function ProductsPage() {
   const links = await prisma.link.findMany({
      include: {},
      orderBy: {
         createdAt: 'desc',
      },
   })

   const formattedLinks: LinkColumn[] = links.map((link) => ({
      id: link.id,
      title: link.title,
      originalUrl: link.originalUrl,
      shortenedUrl: link.shortenedUrl,
      customAlias: link.customAlias,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
   }))

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Links (${links.length})`}
               description="Manage links for your store"
            />
            <Link href="/links/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <LinksTable data={formattedLinks} />
      </div>
   )
}
