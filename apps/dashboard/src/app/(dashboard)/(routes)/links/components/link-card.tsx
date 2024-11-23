import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { BarChart, ExternalLink } from 'lucide-react'

interface Link {
   id: string
   title: string
   shortenedUrl: string
   clicks: number
   createdAt: Date
}

export function LinkCard({ link }: { link: Link }) {
   return (
      <Card className="flex flex-col justify-between">
         <CardContent className="pt-6">
            <h4 className="font-semibold mb-2 truncate" title={link.title}>
               {link.title}
            </h4>
            <p
               className="text-sm text-muted-foreground mb-2 truncate"
               title={link.shortenedUrl}
            >
               {link.shortenedUrl}
            </p>
            <div className="flex justify-between items-center text-sm">
               <span>{link.clicks} clicks</span>
               <span>{link.createdAt.toLocaleDateString()}</span>
            </div>
         </CardContent>
         <CardFooter className="flex justify-between">
            <Button size="sm" variant="outline">
               <ExternalLink className="h-4 w-4 mr-2" />
               Open
            </Button>
            <Button size="sm" variant="outline">
               <BarChart className="h-4 w-4 mr-2" />
               Stats
            </Button>
         </CardFooter>
      </Card>
   )
}
