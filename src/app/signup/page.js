"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, userService } from '../utils/api'  // Adjust the import path as needed

const SignUp = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  })
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
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

  const validateForm = async () => {
    let isValid = true
    let newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
      isValid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
      isValid = false
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    } else {
      // Check if email already exists
      try {
        const emailExists = await userService.checkUserExist(formData.email)
        if (emailExists) {
          newErrors.email = 'This email is already in use'
          isValid = false
        }
      } catch (error) {
        console.error('Error checking email existence:', error)
        newErrors.email = 'Unable to verify email. Please try again.'
        isValid = false
      }
    }

    if (formData.password.length < 2) {
      newErrors.password = 'Password must be at least 2 characters long'
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!await validateForm()) {
      return
    }

    try {
      const result = await authService.register(formData)
      console.log('Registration successful:', result)
      router.push('/users')  // Redirect to users page after successful registration
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors(prevErrors => ({
        ...prevErrors,
        general: 'Registration failed. Please try again.'
      }))
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
                className={`input input-bordered bg-white text-black ${errors.firstName ? 'input-error' : ''}`}
                required 
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
                className={`input input-bordered bg-white text-black ${errors.lastName ? 'input-error' : ''}`}
                required 
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                className={`input input-bordered bg-white text-black ${errors.password ? 'input-error' : ''}`}
                required 
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                className={`input input-bordered bg-white text-black ${errors.confirmPassword ? 'input-error' : ''}`}
                required 
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Role</span>
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`select select-bordered bg-white text-black ${errors.role ? 'select-error' : ''}`}
                required
              >
                <option value="">Select a role</option>
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="STUDENT">Student</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>
            {errors.general && <div className="text-red-500 mt-2">{errors.general}</div>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary text-white">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp