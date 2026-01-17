import { useState, useEffect } from 'react'
import './StatsCard.css'

const StatsCard = ({ icon, label, value }) => {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    // Extract numeric value if it's a string with units (e.g., "12h")
    const numericValue = typeof value === 'string' ? parseInt(value) : value
    const units = typeof value === 'string' ? value.replace(/[0-9]/g, '') : ''

    if (isNaN(numericValue)) {
      setAnimatedValue(value)
      return
    }

    let currentValue = 0
    const increment = numericValue / 20 // Divide into 20 steps
    const interval = setInterval(() => {
      if (currentValue >= numericValue) {
        setAnimatedValue(value)
        clearInterval(interval)
        return
      }
      currentValue += increment
      setAnimatedValue(Math.ceil(currentValue) + units)
    }, 50)

    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{animatedValue}</p>
      </div>
    </div>
  )
}

export default StatsCard
