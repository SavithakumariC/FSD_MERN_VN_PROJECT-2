import React, { useContext, useEffect, useState } from 'react'
import '../styles/navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const userId = localStorage.getItem('userId');
  const usertype = localStorage.getItem('usertype');
  const navigate = useNavigate();
  const { logout } = useContext(GeneralContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      {usertype === 'freelancer' ? (
        <div className="navbar">
          <div className="nav-container">
            <h3>SB Works</h3>
            
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`nav-options ${isMenuOpen ? 'show' : ''}`}>
              <p onClick={() => handleNavigation('/freelancer')}>Dashboard</p>
              <p onClick={() => handleNavigation('/all-projects')}>All Projects</p>
              <p onClick={() => handleNavigation('/my-projects')}>My Projects</p>
              <p onClick={() => handleNavigation('/myApplications')}>Applications</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
      ) : usertype === 'client' ? (
        <div className="navbar">
          <div className="nav-container">
            <h3>SB Works</h3>
            
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`nav-options ${isMenuOpen ? 'show' : ''}`}>
              <p onClick={() => handleNavigation('/client')}>Dashboard</p>
              <p onClick={() => handleNavigation('/new-project')}>New Project</p>
              <p onClick={() => handleNavigation('/project-applications')}>Applications</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
      ) : usertype === 'admin' ? (
        <div className="navbar">
          <div className="nav-container">
            <h3>SB Works (admin)</h3>
            
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`nav-options ${isMenuOpen ? 'show' : ''}`}>
              <p onClick={() => handleNavigation('/admin')}>Home</p>
              <p onClick={() => handleNavigation('/all-users')}>All users</p>
              <p onClick={() => handleNavigation('/admin-projects')}>Projects</p>
              <p onClick={() => handleNavigation('/admin-applications')}>Applications</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Navbar;