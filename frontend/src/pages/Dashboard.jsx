import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StreakCard from '../components/StreakCard'
import ActionTile from '../components/ActionTile'
import SmallTile from '../components/SmallTile'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const [dashboardData, setDashboardData] = useState({
    streak: 6,
    completedToday: false, // Track if user completed today's lesson
    // Last activity can be 'learning' or 'conversation'
    lastActivity: {
      type: 'learning', // 'learning' or 'conversation'
      language: 'Spanish',
      flag: '🇪🇸',
      lessonNumber: 12,
      topic: 'Verb Conjugations',
      date: 'Today'
    },
    // Daily time spent in minutes
    dailyTimeSpent: 45
  })

  // Determine the dynamic continue tile content based on last activity
  const getContinueTileContent = () => {
    const { type, language, flag, lessonNumber, topic } = dashboardData.lastActivity
    
    if (type === 'learning') {
      return {
        title: 'Continue Learning',
        subtitle: `${flag} ${language} • Lesson ${lessonNumber}: ${topic}`,
        icon: '📚',
        link: '/lessons'
      }
    } else {
      return {
        title: 'Practice Conversation',
        subtitle: `${flag} ${language} • Continue your conversation practice`,
        icon: '💬',
        link: '/conversation'
      }
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserName = () => {
    if (!user) return 'User'
    const name = user.name || user.email?.split('@')[0] || 'User'
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getUserInitials = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
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
            <div className="user-profile">
              <div className="user-avatar">
                <span>{getUserInitials()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
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
                title="Daily Time Spent"
                value={formatTimeSpent(dashboardData.dailyTimeSpent)}
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
              streak={dashboardData.streak} 
              completedToday={dashboardData.completedToday}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
