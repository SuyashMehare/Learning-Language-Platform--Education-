import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Admin Panel
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/create-lectures" className="nav-link">
              Create Lectures
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/update-lectures" className="nav-link">
              Update Lectures
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link profile-icon">
              👤 Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
