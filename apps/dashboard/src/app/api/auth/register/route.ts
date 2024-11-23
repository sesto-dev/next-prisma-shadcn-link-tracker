import { signJWT } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { getErrorResponse } from '@/lib/utils'
import { hash } from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { z } from 'zod'

// Define validation schema using Zod
const signupSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
   name: z.string().optional(),
})

export async function POST(req: NextRequest) {
   try {
      const { email, password, name } = signupSchema.parse(await req.json())

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
         return getErrorResponse(400, 'User already exists with this email.')
      }

      // Hash the password
      const passwordHash = await hash(password, 10)

      // Create the user
      const user = await prisma.user.create({
         data: {
            email,
            name,
            passwordHash,
            isEmailVerified: false, // Initially not verified
            // ... other fields as needed
         },
      })

      // Generate JWT
      const token = await signJWT({ sub: user.id }, { exp: '7d' })

      // Set cookies
      const tokenMaxAge = 7 * 24 * 60 * 60 // 7 days in seconds
      const response = new NextResponse(
         JSON.stringify({
            status: 'success',
            token,
         }),
         {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
         }
      )

      response.cookies.set({
         name: 'token',
         value: token,
         httpOnly: true,
         path: '/',
         secure: process.env.NODE_ENV !== 'development',
         maxAge: tokenMaxAge,
      })
      response.cookies.set({
         name: 'logged-in',
         value: 'true',
         maxAge: tokenMaxAge,
      })

      return response
   } catch (error: any) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'Failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
