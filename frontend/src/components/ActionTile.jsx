import { useNavigate } from 'react-router-dom'
import './ActionTile.css'

const ActionTile = ({ title, subtitle, icon, link, gradient }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (link) {
      navigate(link)
    }
  }

  return (
    <div 
      className="action-tile" 
      onClick={handleClick}
      style={{ background: gradient }}
    >
      <div className="tile-icon">{icon}</div>
      <div className="tile-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="tile-arrow">→</div>
    </div>
  )
}

export default ActionTile
