import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLocalStorageObject } from '../hooks/useLocalStorage';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getItem } = useLocalStorageObject();
  // eslint-disable-next-line no-unused-vars
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const wishlistCount = (getItem('wishlist') || []).length;
  const packageWishlistCount = (getItem('packageWishlist') || []).length;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="logo-mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-text">WanderIndia</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/destinations">Destinations</Link></li>
        <li><Link to="/packages">Packages</Link></li>
        {isAuthenticated ? (
          <>
            {isAdmin && <li><Link to="/admin" style={{color: 'var(--primary)', fontWeight: 'bold'}}>Admin</Link></li>}
            <li style={{position: 'relative'}}>
              <Link to="/dashboard" title={`Wishlist (${wishlistCount + packageWishlistCount})`}>
                Dashboard
                {wishlistCount + packageWishlistCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    background: 'var(--accent)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {wishlistCount + packageWishlistCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-user" style={{color: 'var(--muted)', fontSize: '0.9rem'}}>{user?.name?.split(' ')[0]}</li>
            <li className="nav-auth">
              <button onClick={logout} className="nav-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-auth"><Link to="/register" className="nav-register">Register</Link></li>
            <li className="nav-auth"><Link to="/login" className="nav-login">Login</Link></li>
          </>
        )}
      </ul>
      <button 
        onClick={toggleTheme} 
        className="theme-toggle"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
};

export default Navbar;