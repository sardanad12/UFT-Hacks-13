import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import ActionTile from '../components/ActionTile'
import SmallTile from '../components/SmallTile'
import ProfileDropdown from '../components/ProfileDropdown'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  // Safety check - don't render if user is null
  if (!user) return null
  
  const [dashboardData, setDashboardData] = useState({
    completedToday: user.last_active_date == new Date().toISOString().slice(0, 10), // Track if user completed today's lesson
  })

  // Get language flag emoji
  const getLanguageFlag = (language) => {
    const flags = {
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Hindi': '🇮🇳',
      'Chinese': '🇨🇳',
      'Japanese': '🇯🇵',
      'Korean': '🇰🇷',
      'English': '🇬🇧'
    }
    return flags[language] || '🌍'
  }

  // Determine the dynamic continue tile content
  const getContinueTileContent = () => {
    const language = user.last_lesson_language || 'a new language'
    const flag = user.last_lesson_language ? getLanguageFlag(user.last_lesson_language) : '📚'
    
    return {
      title: 'Continue Learning',
      subtitle: user.last_lesson_language 
        ? `${flag} ${language} • Continue your journey`
        : 'Start your language journey',
      icon: '📚',
      link: '/lessons'
    }
  }

  const continueTile = getContinueTileContent()

  // Format time spent
  const formatTimeSpent = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getUserName = () => {
    const name = user.first_name || user.email?.split('@')[0] || 'User'
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="dashboard">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="greeting-section">
              <p className="greeting-time">{getGreeting()}</p>
              <h1 className="greeting-name">{getUserName()}</h1>
            </div>
          </div>
          <div className="header-actions">
            <ProfileDropdown />
          </div>
        </header>

        {/* Stats Overview Bar */}
        <div className="stats-overview">
          <div className="stat-item">
            <span className="stat-label">Current Streak</span>
            <div className="stat-value-with-check">
              <span className="stat-value">{user.daily_streak || 0} days 🔥</span>
              <div className={`completion-indicator ${dashboardData.completedToday ? 'completed' : ''}`}>
                {dashboardData.completedToday ? (
                  <span className="checkmark">✓</span>
                ) : (
                  <span className="empty-circle"></span>
                )}
              </div>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Time Today</span>
            <span className="stat-value">{formatTimeSpent(user.total_time_spent || 0)} ⏱️</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Learning</span>
            <span className="stat-value">
              {user.last_lesson_language ? getLanguageFlag(user.last_lesson_language) : '🌍'} {user.last_lesson_language || 'New Language'}
            </span>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Primary Action Card */}
          <ActionTile
            title={continueTile.title}
            subtitle={continueTile.subtitle}
            icon={continueTile.icon}
            link={continueTile.link}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          
          {/* Secondary Actions */}
          <SmallTile
            title="Practice Speaking"
            subtitle="Have a conversation"
            icon="🎤"
            link="/speaking"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
          <SmallTile
            title="My Progress"
            subtitle="View stats & achievements"
            icon="📊"
            link="/profile"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </div>

      </main>
    </div>
  )
}

export default Dashboard
