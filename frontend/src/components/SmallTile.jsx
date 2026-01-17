import { useNavigate } from 'react-router-dom'
import './SmallTile.css'

const SmallTile = ({ title, value, icon, link, gradient, onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (link) {
      navigate(link)
    }
  }

  return (
    <div 
      className="small-tile" 
      onClick={handleClick}
      style={{ background: gradient }}
    >
      <div className="small-tile-header">
        <div className="small-tile-icon">{icon}</div>
        {link && <div className="small-tile-arrow">→</div>}
      </div>
      <div className="small-tile-content">
        <h4>{title}</h4>
        {value && <p className="small-tile-value">{value}</p>}
      </div>
    </div>
  )
}

export default SmallTile
