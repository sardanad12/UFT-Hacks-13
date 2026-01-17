import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Basic validation
        if (!email || !password) {
          reject(new Error('Email and password are required'))
          return
        }

        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters'))
          return
        }

        // Create user data
        const userData = {
          name: email.split('@')[0],
          email: email,
          loginTime: new Date().toISOString()
        }

        // Store user in state and localStorage
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        resolve(userData)
      }, 1500)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
