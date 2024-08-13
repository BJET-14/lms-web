"use client"
import React, { useState } from 'react'
import { authService } from '../utils/api'  // Adjust the import path as needed
import Cookies from 'js-cookie'

const Authorization = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  })

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    
    // Clear the error when the user starts typing
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
      general: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', password: '', general: '' })

    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: 'Please enter a valid email address'
      }))
      return
    }

    try {
      const result = await authService.login(formData)
      // Redirect to dashboard with a full page reload
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login failed:', error)
      setErrors(prevErrors => ({
        ...prevErrors,
        general: 'Login failed. Please check your credentials.'
      }))
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
                className={`input input-bordered bg-white text-black ${errors.email ? 'input-error' : ''}`}
                required 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            {errors.general && <div className="text-red-500 mt-2">{errors.general}</div>}
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