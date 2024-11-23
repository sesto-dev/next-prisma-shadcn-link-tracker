'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { isEmailValid } from '@persepolis/regex'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// Enum to define the current step in the reset process
enum ResetStep {
   REQUEST = 'REQUEST',
   CONFIRM = 'CONFIRM',
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const [resetStep, setResetStep] = React.useState<ResetStep | null>(null)
   const [resetEmail, setResetEmail] = React.useState<string>('')

   // Log resetEmail whenever it changes
   React.useEffect(() => {
      console.log('resetEmail state updated to:', resetEmail)
   }, [resetEmail])

   return (
      <div className={cn('grid gap-6', className)} {...props}>
         {resetStep === ResetStep.CONFIRM ? (
            <ResetPasswordConfirmComponent
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               setResetStep={setResetStep}
               email={resetEmail}
            />
         ) : resetStep === ResetStep.REQUEST ? (
            <ResetPasswordRequestComponent
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               setResetStep={setResetStep}
               setResetEmail={setResetEmail}
            />
         ) : (
            <EmailPasswordComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
            />
         )}
         {!resetStep && (
            <div className="text-center mt-4">
               <Button
                  variant="link"
                  type="button"
                  onClick={() => setResetStep(ResetStep.REQUEST)}
                  disabled={isLoading}
               >
                  Forgot Password?
               </Button>
            </div>
         )}
      </div>
   )
}

function EmailPasswordComponents({
   isLoading,
   setIsLoading,
}: {
   isLoading: boolean
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
   const [email, setEmail] = React.useState<string>('')
   const [password, setPassword] = React.useState<string>('')
   const router = useRouter()

   async function handleSignUp() {
      setIsLoading(true)
      try {
         const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         })

         const data = await response.json()

         if (response.ok) {
            // Handle successful sign-up (e.g., redirect)
            toast('Sign up successful.')
            router.push('/')
         } else {
            // Handle errors (e.g., display message)
            toast(data.message)
            console.error(data)
         }
      } catch (error) {
         toast(JSON.stringify(error))
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   }

   async function handleLogin() {
      setIsLoading(true)
      try {
         const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         })

         const data = await response.json()

         if (response.ok) {
            // Handle successful login (e.g., redirect)
            toast('Login successful.')
            router.push('/')
         } else {
            // Handle errors (e.g., display message)
            toast(data.message)
            console.error(data)
         }
      } catch (error) {
         toast('Something went wrong.')
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="email"
            >
               Email
            </Label>
            <Input
               id="email"
               placeholder="name@example.com"
               type="email"
               autoCapitalize="none"
               autoComplete="email"
               autoCorrect="off"
               disabled={isLoading}
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />
         </div>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="password"
            >
               Password
            </Label>
            <Input
               id="password"
               placeholder="********"
               type="password"
               autoCapitalize="none"
               autoComplete="current-password"
               autoCorrect="off"
               disabled={isLoading}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
         </div>
         <Button
            onClick={handleLogin}
            disabled={isLoading || !isEmailValid(email) || password.length < 6}
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Login with Email & Password
         </Button>
         <Button
            onClick={handleSignUp}
            disabled={isLoading || !isEmailValid(email) || password.length < 6}
            variant="outline"
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Sign Up with Email & Password
         </Button>
      </>
   )
}

// Reset Password Request Component
function ResetPasswordRequestComponent({
   isLoading,
   setIsLoading,
   setResetStep,
   setResetEmail,
}: {
   isLoading: boolean
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
   setResetStep: React.Dispatch<React.SetStateAction<ResetStep | null>>
   setResetEmail: React.Dispatch<React.SetStateAction<string>>
}) {
   const [email, setEmail] = React.useState<string>('')

   async function handleResetRequest() {
      setIsLoading(true)
      try {
         const response = await fetch('/api/auth/reset/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
         })

         const data = await response.json()

         if (response.ok) {
            toast('Reset OTP sent to your email.')
            console.log('Setting resetEmail to:', email) // Log the email being set
            setResetEmail(email)
            // Transition to OTP + New Password form
            setResetStep(ResetStep.CONFIRM)
         } else {
            toast(data.message)
            console.error(data)
         }
      } catch (error) {
         toast('Something went wrong.')
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="email"
            >
               Email
            </Label>
            <Input
               id="email"
               placeholder="name@example.com"
               type="email"
               autoCapitalize="none"
               autoComplete="email"
               autoCorrect="off"
               disabled={isLoading}
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />
            {!isEmailValid(email) && email.length > 0 && (
               <p className="mt-2 text-sm text-red-700">
                  Please enter a valid email.
               </p>
            )}
         </div>
         <Button
            onClick={handleResetRequest}
            disabled={isLoading || !isEmailValid(email)}
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Send Reset Link
         </Button>
         <Button
            variant="link"
            type="button"
            onClick={() => setResetStep(null)}
            disabled={isLoading}
            className="mt-2"
         >
            Back to Login
         </Button>
      </>
   )
}

// Reset Password Confirmation Component (OTP + New Password)
function ResetPasswordConfirmComponent({
   isLoading,
   setIsLoading,
   setResetStep,
   email,
}: {
   isLoading: boolean
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
   setResetStep: React.Dispatch<React.SetStateAction<ResetStep | null>>
   email: string
}) {
   const [otp, setOtp] = React.useState<string>('')
   const [newPassword, setNewPassword] = React.useState<string>('')
   const router = useRouter()

   // Log received email prop
   React.useEffect(() => {
      console.log('ResetPasswordConfirmComponent received email:', email)
   }, [email])

   async function handleConfirmReset() {
      console.log('Confirm Reset Data:', { email, OTP: otp, newPassword }) // Log the data being sent
      setIsLoading(true)
      try {
         const response = await fetch('/api/auth/reset/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, OTP: otp, newPassword }),
         })

         const data = await response.json()

         if (response.ok) {
            toast('Password has been reset successfully.')
            router.push('/login')
         } else {
            toast(data.message)
            console.error(data)
         }
      } catch (error) {
         toast(JSON.stringify(error))
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="otp"
            >
               OTP Code
            </Label>
            <Input
               id="otp"
               placeholder="Enter OTP"
               type="text"
               autoCapitalize="none"
               autoComplete="one-time-code"
               autoCorrect="off"
               disabled={isLoading}
               value={otp}
               onChange={(e) => setOtp(e.target.value)}
               required
            />
         </div>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="new-password"
            >
               New Password
            </Label>
            <Input
               id="new-password"
               placeholder="********"
               type="password"
               autoCapitalize="none"
               autoComplete="new-password"
               autoCorrect="off"
               disabled={isLoading}
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               required
            />
         </div>
         <Button
            onClick={handleConfirmReset}
            disabled={
               isLoading || otp.trim().length === 0 || newPassword.length < 6
            }
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Reset Password
         </Button>
         <Button
            variant="link"
            type="button"
            onClick={() => setResetStep(null)}
            disabled={isLoading}
            className="mt-2"
         >
            Back to Login
         </Button>
      </>
   )
}
