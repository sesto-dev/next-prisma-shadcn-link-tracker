import prisma from '@/lib/prisma'

export const getTotalRevenue = async () => {
   const clicks = await prisma.click.findMany({
      where: {},
      include: {},
   })

   const totalRevenue = clicks.reduce((total, click) => {
      return total + 1
   }, 0)

   return totalRevenue
}
