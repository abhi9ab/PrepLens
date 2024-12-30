import React from 'react'
import Header from './_components/Header'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from "@/components/theme-provider"

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <div className='mx-5 md:mx-20 lg:mx-36'>
          <Toaster />
          {children}
        </div>
      </ThemeProvider>
    </div>
  )
}

export default DashboardLayout