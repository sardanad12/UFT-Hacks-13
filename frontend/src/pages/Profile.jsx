import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Safety check - don't render if user is null
  if (!user) return null

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

  // Build profile data from user object
  const profileData = {
    name: user.first_name || user.email?.split('@')[0] || 'Language Learner',
    email: user.email || 'user@example.com',
    joinDate: 'January 2026', // Could be calculated from user creation date if available
    currentLanguage: user.last_lesson_language || (user.languages_studied?.[0]?.language) || 'No language yet',
    languageFlag: user.last_lesson_language ? getLanguageFlag(user.last_lesson_language) : (user.languages_studied?.[0] ? getLanguageFlag(user.languages_studied[0].language) : '🌍'),
    stats: {
      totalTime: user.total_time_spent || 0,
      streak: user.daily_streak || 0,
      lessonsCompleted: user.total_lessons_completed || 0,
      wordsLearned: 0, // Not in user schema, could calculate from lessons
      conversationMinutes: 0, // Not in user schema
      currentLevel: user.languages_studied?.[0]?.level || 'Beginner'
    }
  }

  // Format time in minutes to hours/minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return { hours, minutes: mins }
  }

  const totalTime = formatTime(profileData.stats.totalTime)

  const getUserInitials = () => {
    const name = user.first_name || user.email?.split('@')[0] || 'User'
    return name.charAt(0).toUpperCase()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="profile-page">
      <main className="profile-content">
        {/* Header */}
        <header className="profile-header">
          <h1>My Profile</h1>
          <p>View and manage your learning journey</p>
        </header>

        {/* Profile Card Section */}
        <div className="profile-card">
          <div className="profile-avatar-large">
            <span>{getUserInitials()}</span>
          </div>
          
          <div className="profile-info">
            <h2>{profileData.name}</h2>
            <p className="profile-email">{profileData.email}</p>
            <div className="profile-meta">
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Joined {profileData.joinDate}
              </span>
              <span className="meta-item">
                <span className="meta-icon">{profileData.languageFlag}</span>
                Learning {profileData.currentLanguage}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📊</span>
                {profileData.stats.currentLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-section">
          <h3 className="section-title">Your Statistics</h3>
          
          <div className="stats-grid">
            {/* Total Time Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <span className="stat-icon">⏱️</span>
              </div>
              <div className="stat-details">
                <h4 className="stat-label">Total Time</h4>
                <p className="stat-value">{totalTime.hours}h {totalTime.minutes}m</p>
              </div>
            </div>

            {/* Streak Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'}}>
                <span className="stat-icon">🔥</span>
              </div>
              <div className="stat-details">
                <h4 className="stat-label">Current Streak</h4>
                <p className="stat-value">{profileData.stats.streak} days</p>
              </div>
            </div>

            {/* Lessons Completed Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                <span className="stat-icon">📚</span>
              </div>
              <div className="stat-details">
                <h4 className="stat-label">Lessons Completed</h4>
                <p className="stat-value">{profileData.stats.lessonsCompleted}</p>
              </div>
            </div>

            {/* Words Learned Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                <span className="stat-icon">💬</span>
              </div>
              <div className="stat-details">
                <h4 className="stat-label">Words Learned</h4>
                <p className="stat-value">{profileData.stats.wordsLearned}</p>
              </div>
            </div>

            {/* Conversation Time Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                <span className="stat-icon">🎙️</span>
              </div>
              <div className="stat-details">
                <h4 className="stat-label">Conversation Time</h4>
                <p className="stat-value">{profileData.stats.conversationMinutes} min</p>
              </div>
            </div>

            {/* Level Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}}>
                <span className="stat-icon">⭐</span>
              </div>
              <div className="stat-details">
                <h4 className="stat-label">Current Level</h4>
                <p className="stat-value">{profileData.stats.currentLevel}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
