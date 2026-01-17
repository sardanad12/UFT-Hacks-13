import { useState, useEffect } from 'react'
import './StreakCard.css'

const StreakCard = ({ streak, completedToday = false }) => {
  const [animatedStreak, setAnimatedStreak] = useState(0)

  useEffect(() => {
    let currentStreak = 0
    const interval = setInterval(() => {
      if (currentStreak >= streak) {
        clearInterval(interval)
        return
      }
      currentStreak++
      setAnimatedStreak(currentStreak)
    }, 100)

    return () => clearInterval(interval)
  }, [streak])

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div className="flame-icon">🔥</div>
        <div>
          <h3>Current Streak</h3>
          <p className="streak-subtitle">You're on fire!</p>
        </div>
      </div>
      
      <div className="streak-count">
        <span className="streak-number">{animatedStreak}</span>
        <span className="streak-label">days</span>
      </div>
      
      {/* Daily Completion Indicator */}
      <div className="daily-completion">
        <div className="completion-label">Today's Lesson</div>
        <div className={`completion-box ${completedToday ? 'completed' : ''}`}>
          {completedToday ? (
            <span className="checkmark">✓</span>
          ) : (
            <span className="empty-circle"></span>
          )}
        </div>
      </div>
    </div>
  )
}

export default StreakCard
