import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
   originalUrl: z.string().url().min(1, 'Original URL is required'),
   customAlias: z.string().optional(),
   expiresAt: z
      .string()
      .optional()
      .refine((date) => {
         return !date || !isNaN(Date.parse(date))
      }, 'Invalid date format'),
   title: z.string().optional(),
   description: z.string().optional(),
})

type LinkFormValues = z.infer<typeof formSchema>

interface LinkFormProps {
   initialData: Link | null
}

export const LinkForm: React.FC<LinkFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Edit Link' : 'Create Link'
   const description = initialData
      ? 'Edit your link.'
      : 'Create a new shortened link.'
   const toastMessage = initialData ? 'Link updated.' : 'Link created.'
   const action = initialData ? 'Save changes' : 'Create'

   const defaultValues = initialData
      ? {
           ...initialData,
           expiresAt: initialData.expiresAt
              ? initialData.expiresAt.toISOString().split('T')[0]
              : '',
        }
      : {
           originalUrl: '',
           customAlias: '',
           expiresAt: '',
           title: '',
           description: '',
        }

   const form = useForm<LinkFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues,
   })

   const onSubmit = async (data: LinkFormValues) => {
      try {
         setLoading(true)

         const payload = {
            ...data,
            expiresAt: data.expiresAt
               ? new Date(data.expiresAt).toISOString()
               : null,
         }

         if (initialData) {
            await fetch(`/api/links/${params.linkId}`, {
               method: 'PATCH',
               body: JSON.stringify(payload),
               cache: 'no-store',
            })
         } else {
            await fetch(`/api/links`, {
               method: 'POST',
               body: JSON.stringify(payload),
               cache: 'no-store',
            })
         }

         router.refresh()
         router.push(`/links`)
         toast(toastMessage)
      } catch (error: any) {
         toast('Something went wrong.')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)

         await fetch(`/api/links/${params.linkId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         router.refresh()
         router.push(`/links`)
         toast.success('Link deleted.')
      } catch (error: any) {
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
               >
                  Delete
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-8 w-full"
            >
               <FormField
                  control={form.control}
                  name="originalUrl"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Original URL</FormLabel>
                        <FormControl>
                           <Input
                              disabled={loading}
                              placeholder="https://example.com"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="customAlias"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Custom Alias</FormLabel>
                        <FormDescription>
                           Optional custom alias for your shortened URL.
                        </FormDescription>
                        <FormControl>
                           <Input
                              disabled={loading}
                              placeholder="my-custom-alias"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormDescription>
                           Optional expiration date for the shortened URL.
                        </FormDescription>
                        <FormControl>
                           <Input type="date" disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                           <Input
                              disabled={loading}
                              placeholder="Link Title"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Input
                              disabled={loading}
                              placeholder="Link Description"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   )
}
