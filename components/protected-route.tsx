"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

export default function ProtectedRouteWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // Only run after auth state is determined and on dashboard routes
    if (!loading && !user && pathname?.startsWith('/dashboard')) {
      router.push('/login')
    }
  }, [user, loading, router, pathname])

  // Show nothing while checking auth, preventing flash of protected content
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If not authenticated and on a dashboard route, don't render children
  // This is a backup in case the redirect hasn't happened yet
  if (!user && pathname?.startsWith('/dashboard')) {
    return null
  }

  // Otherwise, render the children
  return <>{children}</>
}
