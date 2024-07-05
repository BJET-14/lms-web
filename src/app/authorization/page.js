'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../utils/api'  // Adjust the import path as needed

const Authorization = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await authService.login(formData)
      console.log('Login successful:', result)
      // Redirect based on role
      if (result.role === 'ADMIN') {
        router.push('/admin-dashboard')
      } else {
        router.push('/user-dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="card w-full max-w-md bg-gray-50 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold text-black">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Email</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered bg-white text-black" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered bg-white text-black" 
                required 
              />
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Authorization