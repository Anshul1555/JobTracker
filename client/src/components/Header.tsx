import { useNavigate, Link } from 'react-router-dom';
import "../css/header.css";

const Header = () => {
  const navigate = useNavigate();
  // Function to handle logout
  const isLoggedIn = () => !!localStorage.getItem('id_token');
  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profileId');

    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="header-container">
        <Link to="/home" className="logo">JobTracker</Link>
        {isLoggedIn() && !isLoginOrSignup && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
