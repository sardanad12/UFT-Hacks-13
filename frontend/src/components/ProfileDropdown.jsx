import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './ProfileDropdown.css'

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getUserName = () => {
    if (!user) return 'User'
    const name = user.first_name || user.email?.split('@')[0] || 'User'
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getUserInitials = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
  }

  const getUserEmail = () => {
    return user?.email || 'user@example.com'
  }

  const handleProfileClick = () => {
    setIsOpen(false)
    navigate('/profile')
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    // Navigate to settings when the page is created
    // For now, we can use profile as placeholder or show a message
    navigate('/profile') // Change to '/settings' when settings page exists
  }

  const handleLogout = () => {
    setIsOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <div 
        className="user-avatar" 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen)
          }
        }}
      >
        <span>{getUserInitials()}</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {/* User Info Section */}
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              <span>{getUserInitials()}</span>
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-user-name">{getUserName()}</div>
              <div className="dropdown-user-email">{getUserEmail()}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {/* Menu Items */}
          <div className="dropdown-items">
            <button 
              className="dropdown-item" 
              onClick={handleProfileClick}
            >
              <span className="dropdown-item-icon">👤</span>
              <span className="dropdown-item-text">Profile</span>
            </button>

            <button 
              className="dropdown-item" 
              onClick={handleSettingsClick}
            >
              <span className="dropdown-item-icon">⚙️</span>
              <span className="dropdown-item-text">Settings</span>
            </button>
          </div>

          <div className="dropdown-divider"></div>

          {/* Logout Button */}
          <div className="dropdown-footer">
            <button 
              className="dropdown-item logout-item" 
              onClick={handleLogout}
            >
              <span className="dropdown-item-icon">🚪</span>
              <span className="dropdown-item-text">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
