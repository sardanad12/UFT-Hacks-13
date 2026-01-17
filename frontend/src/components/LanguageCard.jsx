import { useEffect, useRef } from 'react'
import './LanguageCard.css'

const LanguageCard = ({ language }) => {
  const progressBarRef = useRef(null)

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${language.progress}%`
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [language.progress])

  return (
    <div className="language-card">
      <div className="language-header">
        <div className="language-flag">{language.flag}</div>
        <div className="language-info">
          <h3>{language.name}</h3>
          <span className="language-level">{language.level}</span>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percentage">{language.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            ref={progressBarRef}
            className="progress-fill" 
            data-progress={language.progress}
          />
        </div>
      </div>
      
      <div className="language-stats">
        <div className="language-stat">
          <span className="language-stat-value">{language.wordsLearned}</span>
          <span className="language-stat-label">Words</span>
        </div>
        <div className="language-stat">
          <span className="language-stat-value">{language.lessonsCompleted}</span>
          <span className="language-stat-label">Lessons</span>
        </div>
      </div>
    </div>
  )
}

export default LanguageCard
