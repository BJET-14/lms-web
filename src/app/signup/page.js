"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../utils/api'  // Adjust the import path as needed

const SignUp = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''  // Default role
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const result = await authService.register(formData)
      console.log('Registration successful:', result)
      router.push('/authorization')  // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration failed:', error)
      setError('Registration failed. Please try again.')
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    router.push('/authorization')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="card w-full max-w-md bg-gray-50 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold text-black">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">First Name</span>
              </label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered bg-white text-black" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Last Name</span>
              </label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered bg-white text-black" 
                required 
              />
            </div>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Confirm Password</span>
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered bg-white text-black" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Role</span>
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered bg-white text-black"
                required
              >
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary text-white">Sign Up</button>
            </div>
          </form>
          {/* <div className="text-center mt-4">
            <span className="text-sm text-black">Already have an account?</span>
            <a href="#" onClick={handleLoginClick} className="text-sm font-medium text-primary hover:underline ml-1">Login</a>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default SignUp