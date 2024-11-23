import { Toaster } from '@/components/ui/sonner'
import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   title: 'Dashboard',
   description: 'Link Tracker Dashboard',
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
               <Toaster />
               <ModalProvider />
               {children}
            </ThemeProvider>
         </body>
      </html>
   )
}
