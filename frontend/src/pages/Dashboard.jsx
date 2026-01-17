import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StreakCard from '../components/StreakCard'
import StatsCard from '../components/StatsCard'
import LanguageCard from '../components/LanguageCard'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const [dashboardData, setDashboardData] = useState({
    streak: 6,
    lessonsCompleted: 24,
    timeSpent: 12,
    languages: [
      {
        id: 1,
        name: 'Spanish',
        flag: '🇪🇸',
        level: 'Intermediate',
        progress: 68,
        wordsLearned: 450,
        lessonsCompleted: 18
      },
      {
        id: 2,
        name: 'French',
        flag: '🇫🇷',
        level: 'Beginner',
        progress: 35,
        wordsLearned: 180,
        lessonsCompleted: 8
      },
      {
        id: 3,
        name: 'Japanese',
        flag: '🇯🇵',
        level: 'Advanced',
        progress: 82,
        wordsLearned: 720,
        lessonsCompleted: 32
      }
    ]
  })

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
      <Sidebar onLogout={handleLogout} />
      
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
        
        {/* Streak Section */}
        <section className="streak-section">
          <StreakCard streak={dashboardData.streak} />
          
          <div className="stats-grid">
            <StatsCard
              icon="📚"
              label="Lessons Completed"
              value={dashboardData.lessonsCompleted}
            />
            <StatsCard
              icon="⏱️"
              label="Time Spent"
              value={`${dashboardData.timeSpent}h`}
            />
          </div>
        </section>
        
        {/* Language Proficiency Section */}
        <section className="proficiency-section">
          <h2>Your Language Proficiency</h2>
          
          <div className="languages-grid">
            {dashboardData.languages.map((language) => (
              <LanguageCard key={language.id} language={language} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
