import prisma from '@/lib/prisma'

interface GraphData {
   name: string
   total: number
}

export const getGraphRevenue = async (): Promise<GraphData[]> => {
   const clicks = await prisma.click.findMany({
      where: {},
      include: {},
   })

   const monthlyRevenue: { [key: number]: number } = {}

   // Grouping the orders by month and summing the revenue
   for (const click of clicks) {
      const month = click.createdAt.getMonth() // 0 for Jan, 1 for Feb, ...

      // Adding the revenue for this click to the respective month
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + 1
   }

   // Converting the grouped data into the format expected by the graph
   const graphData: GraphData[] = [
      { name: 'Jan', total: 0 },
      { name: 'Feb', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Apr', total: 0 },
      { name: 'May', total: 0 },
      { name: 'Jun', total: 0 },
      { name: 'Jul', total: 0 },
      { name: 'Aug', total: 0 },
      { name: 'Sep', total: 0 },
      { name: 'Oct', total: 0 },
      { name: 'Nov', total: 0 },
      { name: 'Dec', total: 0 },
   ]

   // Filling in the revenue data
   for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
   }

   return graphData
}
