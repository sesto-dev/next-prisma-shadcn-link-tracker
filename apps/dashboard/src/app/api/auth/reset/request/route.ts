import config from '@/config/site'
import ResetPasswordMail from '@/emails/reset-password-request'
// New email template
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const { email } = await req.json()

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
         where: { email: email.toLowerCase() },
      })
      if (!user) {
         return getErrorResponse(404, 'User not found')
      }

      // Generate OTP
      const OTP = generateSerial({ batchSize: 6 })

      // Update user's OTP and OTPType
      await prisma.user.update({
         where: { email: email.toLowerCase() },
         data: { OTP },
      })

      // Send reset password email
      await sendMail({
         name: config.name,
         to: email,
         subject: 'Reset Your Password',
         html: await render(
            ResetPasswordMail({ code: OTP, name: config.name })
         ),
      })

      return new NextResponse(
         JSON.stringify({
            status: 'success',
            email,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'Failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
