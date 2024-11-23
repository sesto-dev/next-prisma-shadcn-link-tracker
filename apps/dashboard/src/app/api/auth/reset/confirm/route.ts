import prisma from '@/lib/prisma'
import { getErrorResponse } from '@/lib/utils'
import { hash } from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { z } from 'zod'

const resetSchema = z.object({
   email: z.string().email(),
   OTP: z.string().length(6),
   newPassword: z.string().min(6),
})

export async function POST(req: NextRequest) {
   try {
      const { email, OTP, newPassword } = await req.json()

      console.log('Received email:', email)
      console.log('Received OTP:', OTP)
      console.log('Received newPassword:', newPassword)

      // Validate input
      const {
         email: validatedEmail,
         OTP: validatedOTP,
         newPassword: validatedPassword,
      } = resetSchema.parse({
         email,
         OTP,
         newPassword,
      })

      // Find user with email and OTPType = 'PasswordReset'
      const user = await prisma.user.findFirst({
         where: {
            email: validatedEmail.toLowerCase(),
            OTP: validatedOTP,
         },
      })

      if (!user) {
         return getErrorResponse(400, 'Invalid OTP or Email')
      }

      // Hash the new password
      const hashedPassword = await hash(validatedPassword, 10)

      // Update user's password and clear OTP and OTPType
      await prisma.user.update({
         where: { email: validatedEmail.toLowerCase() },
         data: {
            passwordHash: hashedPassword,
            OTP: null,
         },
      })

      return new NextResponse(
         JSON.stringify({
            status: 'success',
            message: 'Password reset successfully.',
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error: any) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'Failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
