import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({ email: '', password: '' })
    
    let isValid = true
    const newErrors = {}

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email'
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (!isValid) {
      setErrors(newErrors)
      return
    }

    // Submit form
    setLoading(true)
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ email: error.message || 'Login failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" stroke="#6366f1" strokeWidth="4"/>
            <path d="M20 30 L28 38 L42 22" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1>Welcome Back!</h1>
        <p className="subtitle">Continue your language learning journey</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className={`btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
            <span className="btn-text">Sign In</span>
            {loading && <span className="btn-loader"></span>}
          </button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <button className="btn-secondary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 4 2.9 7.3 6.7 7.9v-5.6H6.9V10h1.8V8.3c0-1.8 1.1-2.8 2.7-2.8.8 0 1.6.1 1.6.1v1.8h-.9c-.9 0-1.2.5-1.2 1.1V10h2l-.3 2.3h-1.7v5.6c3.8-.6 6.7-3.9 6.7-7.9z" fill="#1877F2"/>
          </svg>
          Continue with Facebook
        </button>
        
        <p className="signup-link">Don't have an account? <a href="#">Sign up</a></p>
      </div>
      
      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  )
}

export default Login
