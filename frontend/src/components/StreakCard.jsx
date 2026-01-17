import { useState, useEffect } from 'react'
import './StreakCard.css'

const StreakCard = ({ streak }) => {
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
      
      <div className="streak-calendar">
        {weekDays.map((day, index) => {
          let className = 'calendar-day'
          if (index < streak - 1) {
            className += ' completed'
          } else if (index === streak - 1) {
            className += ' active'
          }
          
          return (
            <div key={index} className={className} title={`Day ${index + 1}`}>
              <span>{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StreakCard
