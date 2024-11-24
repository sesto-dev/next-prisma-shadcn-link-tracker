import { MembershipType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Helper Functions
function getRandomFloat(min: number, max: number, precision: number): number {
   if (min >= max || precision < 0) {
      throw new Error(
         'Invalid input: min should be less than max and precision should be non-negative.'
      )
   }

   const range = max - min
   const randomValue = Math.random() * range + min

   return parseFloat(randomValue.toFixed(precision))
}

function getRandomIntInRange(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min) + min)
}

function getRandomDate(start: Date, end: Date): Date {
   return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
   )
}

function getRandomBoolean(): boolean {
   return Math.random() >= 0.5
}

function getRandomDeviceType(): 'Desktop' | 'Mobile' | 'Tablet' | 'Other' {
   const types = ['Desktop', 'Mobile', 'Tablet', 'Other']
   return types[getRandomIntInRange(0, types.length)] as
      | 'Desktop'
      | 'Mobile'
      | 'Tablet'
      | 'Other'
}

async function main() {
   // Clear existing data
   await prisma.click.deleteMany()
   await prisma.link.deleteMany()
   await prisma.project.deleteMany()
   await prisma.membership.deleteMany()
   await prisma.team.deleteMany()
   await prisma.user.deleteMany()

   // Create Users with hashed passwords
   const usersData = [
      {
         email: 'accretence@gmail.com',
         phone: '1234567890',
         name: 'John Doe',
         birthday: '1990-01-01',
         OTP: '123456',
         referralCode: 'REF123',
         isBanned: false,
         isEmailVerified: true,
         isPhoneVerified: true,
         isEmailSubscribed: true,
         isPhoneSubscribed: true,
         passwordHash: await bcrypt.hash('password123', 10),
      },
      {
         email: 'sesto@post.com',
         phone: '0987654321',
         name: 'Jane Smith',
         birthday: '1985-05-15',
         OTP: '654321',
         referralCode: 'REF456',
         isBanned: false,
         isEmailVerified: true,
         isPhoneVerified: true,
         isEmailSubscribed: true,
         isPhoneSubscribed: true,
         passwordHash: await bcrypt.hash('securePass!@#', 10),
      },
   ]

   const users = await Promise.all(
      usersData.map((user) => prisma.user.create({ data: user }))
   )

   console.log('Created Users with hashed passwords...')

   // Create Teams
   const teamsData = [
      {
         title: 'Team Alpha',
      },
      {
         title: 'Team Beta',
      },
   ]

   const teams = await prisma.team.createMany({
      data: teamsData,
   })

   console.log('Created Teams...')

   // Retrieve the created teams to get their IDs
   const allTeams = await prisma.team.findMany()

   // Create Memberships (Associating Users with Teams)
   const membershipsData = [
      {
         userId: users[0].id,
         teamId: allTeams[0].id,
         membershipType: MembershipType.OWNER,
      },
      {
         userId: users[1].id,
         teamId: allTeams[0].id,
         membershipType: MembershipType.MEMBER,
      },
      {
         userId: users[1].id,
         teamId: allTeams[1].id,
         membershipType: MembershipType.OWNER,
      },
   ]

   await prisma.membership.createMany({
      data: membershipsData,
   })

   console.log('Created Team Memberships...')

   // Create Projects for each Team
   const projectsData = [
      {
         title: 'Project X',
         teamId: allTeams[0].id,
      },
      {
         title: 'Project Y',
         teamId: allTeams[1].id,
      },
   ]

   const projects = await prisma.project.createMany({
      data: projectsData,
   })

   console.log('Created Projects...')

   // Retrieve the created projects to get their IDs
   const allProjects = await prisma.project.findMany()

   // Create Links for each Project
   const linksData = [
      {
         originalUrl: 'https://www.example.com',
         customAlias: 'home',
         expiresAt: null,
         title: 'Example Home',
         description: 'The homepage of Example.com',
         projectId: allProjects[0].id,
         userId: users[0].id,
      },
      {
         originalUrl: 'https://www.openai.com',
         customAlias: 'openai',
         expiresAt: null,
         title: 'OpenAI',
         description: 'OpenAI Official Website',
         projectId: allProjects[0].id,
         userId: users[0].id,
      },
      {
         originalUrl: 'https://www.github.com',
         customAlias: 'github',
         expiresAt: null,
         title: 'GitHub',
         description: 'GitHub - Where the world builds software',
         projectId: allProjects[1].id,
         userId: users[1].id,
      },
   ]

   const links = await Promise.all(
      linksData.map((link) => prisma.link.create({ data: link }))
   )

   console.log('Created Links...')

   // Simulate Clicks for each Link
   const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'Mozilla/5.0 (Linux; Android 10)',
      'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
   ]

   const countries = ['USA', 'Canada', 'UK', 'Germany', 'Australia']
   const regions = [
      'California',
      'Ontario',
      'England',
      'Bavaria',
      'New South Wales',
   ]
   const cities = ['Los Angeles', 'Toronto', 'London', 'Munich', 'Sydney']

   const clicksData = []

   for (const link of links) {
      const numberOfClicks = getRandomIntInRange(5, 15)
      for (let i = 0; i < numberOfClicks; i++) {
         const click = {
            createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
            ipAddress: `192.168.${getRandomIntInRange(0, 255)}.${getRandomIntInRange(0, 255)}`,
            userAgent: userAgents[getRandomIntInRange(0, userAgents.length)],
            referer: getRandomBoolean() ? 'https://www.google.com' : null,
            country: countries[getRandomIntInRange(0, countries.length)],
            region: regions[getRandomIntInRange(0, regions.length)],
            city: cities[getRandomIntInRange(0, cities.length)],
            deviceType: getRandomDeviceType(),
            browser: 'Chrome',
            os: 'Windows',
            linkId: link.id,
         }
         clicksData.push(click)
      }
   }

   await prisma.click.createMany({ data: clicksData })

   console.log('Created Clicks...')
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })
