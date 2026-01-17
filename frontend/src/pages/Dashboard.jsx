import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StreakCard from '../components/StreakCard'
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
    completedToday: false, // Track if user completed today's lesson
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

  // Determine the dynamic continue tile content based on last activity
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

  // Format daily time spent
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

  return (
    <div className="dashboard">
  
      
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Welcome back, <span className="user-name">{getUserName()}</span>! 👋</h1>
            <p>Keep up the great work on your language learning journey!</p>
          </div>
          <div className="header-right">
            <ProfileDropdown />
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className='dashboard-wrapper'>
        <div className="dashboard-content">
          {/* Action Tiles Section - 4/5 of space */}
          <div className="action-tiles-section">
            {/* Dynamic Continue Tile - based on last activity */}
            <ActionTile
              title={continueTile.title}
              subtitle={continueTile.subtitle}
              icon={continueTile.icon}
              link={continueTile.link}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            
            {/* Two Small Tiles Row */}
            <div className="small-tiles-row">
              <SmallTile
                title="Total Time Spent"
                value={formatTimeSpent(user.total_time_spent || 0)}
                icon="⏱️"
                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              />
              <SmallTile
                title="My Profile"
                icon="👤"
                link="/profile"
                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              />
            </div>
          </div>

          {/* Streak Section - 1/5 of space */}
          <div className="streak-section">
            <StreakCard 
              streak={user.daily_streak || 0} 
              completedToday={dashboardData.completedToday}
            />
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
