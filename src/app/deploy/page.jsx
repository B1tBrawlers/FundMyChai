'use client';

// This file is used to redirect users to a Vercel deployment
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function VercelRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://vercel.com/new/clone?repository-url=https://github.com/yourusername/simple-fund'
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <img src="/vercel.svg" alt="Vercel Logo" className="w-16 h-16 mb-8" />
      <h1 className="text-2xl font-bold mb-4">Redirecting to Vercel...</h1>
      <p>You will be redirected to deploy this project on Vercel in a few seconds.</p>
    </div>
  )
}
