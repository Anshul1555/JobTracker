import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="container flex-row space-between align-center">
        <Link to="/home" className="logo">JobTracker</Link>
        <div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;