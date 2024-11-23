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

interface Team {
   id: string
   title: string
   color: string
}

interface LinkCardProps {
   link: Link
   team?: Team
   teamColor?: string
}

export function LinkCard({ link, team, teamColor }: LinkCardProps) {
   return (
      <Card className="flex flex-col justify-between">
         <CardContent className="pt-6">
            <div className="flex items-center mb-2">
               {team && (
                  <span
                     className={`inline-block text-xs text-white px-2 py-1 rounded-full mr-2 ${teamColor || 'bg-gray-500'}`}
                  >
                     {team.title}
                  </span>
               )}
               <h4 className="font-semibold truncate" title={link.title}>
                  {link.title}
               </h4>
            </div>
            <p
               className="text-sm text-muted-foreground mb-2 truncate"
               title={link.shortenedUrl}
            >
               {link.shortenedUrl}
            </p>
            <div className="flex justify-between items-center text-sm">
               <span>{link.clicks} clicks</span>
               <span>{new Date(link.createdAt).toLocaleDateString()}</span>
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
