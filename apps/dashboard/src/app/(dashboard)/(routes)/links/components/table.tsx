'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LinksTableProps {
   data: LinkColumn[]
}

export const LinksTable: React.FC<LinksTableProps> = ({ data }) => {
   const router = useRouter()

   return <DataTable searchKey="title" columns={columns} data={data} />
}

export type LinkColumn = {
   id: string
   title: string
   originalUrl: string
   shortenedUrl: string
   customAlias: string
   expiresAt: Date
   createdAt: Date
   updatedAt: Date
}

export const columns: ColumnDef<LinkColumn>[] = [
   {
      accessorKey: 'title',
      header: 'Title',
   },
   {
      accessorKey: 'originalUrl',
      header: 'Original URL',
   },
   {
      accessorKey: 'shortenedUrl',
      header: 'Shortened URL',
   },
   {
      accessorKey: 'customAlias',
      header: 'Custom Alias',
   },
   {
      accessorKey: 'expiresAt',
      header: 'Expires At',
   },
   {
      accessorKey: 'createdAt',
      header: 'Created At',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/links/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
