import {
   Body,
   Container,
   Link as EmailLink,
   Head,
   Html,
   Text,
} from '@react-email/components'
import React from 'react'

interface ResetPasswordMailProps {
   code: string
   name: string
}

export default function ResetPasswordMail({
   code,
   name,
}: ResetPasswordMailProps) {
   return (
      <Html>
         <Head />
         <Body>
            <Container>
               <Text>Hello,</Text>
               <Text>
                  You requested to reset your password. Use the code below to
                  proceed:
               </Text>
               <Text>
                  <strong>{code}</strong>
               </Text>
               <Text>
                  If you did not request this, please ignore this email.
               </Text>
               <EmailLink
                  href={`${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?email=${encodeURIComponent(name)}&OTP=${code}`}
               >
                  Reset Password
               </EmailLink>
            </Container>
         </Body>
      </Html>
   )
}
