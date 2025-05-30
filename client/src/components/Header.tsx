import { useNavigate, Link } from 'react-router-dom';
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  // Function to handle logout
  const isLoggedIn = () => !!localStorage.getItem('id_token');

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="header-container">
        <Link to="/home" className="logo">JobTracker</Link>
        {isLoggedIn() && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
