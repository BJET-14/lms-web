'use client'
import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'

const Authorization = () => {
  const router = useRouter()

  const handleSignUpClick = (e) => {
    e.preventDefault()
    router.push('/signup')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-black shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
          </div>
          <button type="submit" className="w-full py-2 text-black bg-indigo-600 rounded-md hover:bg-indigo-500">Login</button>
        </form>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm">Don't have an account?</span>
          <a href="#" onClick={handleSignUpClick} className="text-sm font-medium text-indigo-600 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  )
}

export default Authorization