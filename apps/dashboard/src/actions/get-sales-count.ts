import prisma from '@/lib/prisma'

export const getSalesCount = async () => {
   const salesCount = await prisma.click.count({
      where: {},
   })

   return salesCount
}
