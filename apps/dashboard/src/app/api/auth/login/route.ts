import { signJWT } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { getErrorResponse } from '@/lib/utils'
import { compare } from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { z } from 'zod'

// Define validation schema using Zod
const loginSchema = z.object({
   email: z.string().email(),
   password: z.string(),
})

export async function POST(req: NextRequest) {
   try {
      const { email, password } = loginSchema.parse(await req.json())

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user || !user.passwordHash) {
         return getErrorResponse(401, 'Invalid email or password.')
      }

      // Compare passwords
      const isPasswordValid = await compare(password, user.passwordHash)
      if (!isPasswordValid) {
         return getErrorResponse(401, 'Invalid email or password.')
      }

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
            status: 200,
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
