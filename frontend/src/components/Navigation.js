import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './navigation.css';
import { jwtDecode } from 'jwt-decode';
import contextAuthentication from '../context/contextAuth';

function Navigation() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { user, logout } = useContext(contextAuthentication);
  const token = localStorage.getItem('AuthenticationToken');
  //State variables initialised

  useEffect(() => {
    showButton();
  }, []);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  //Checks to see if window size width is < 960 and renders button

  window.addEventListener('resize', showButton);

  const menuClick = () => setClick(!click);
  const closeMenu = () => setClick(false);

  let isLoggedIn = false;

  if (token) {
    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access;
    const dec = jwtDecode(accessToken);
    isLoggedIn = true;
  }
  //Checks to see if token exist and decodes

  return (
    <>
      <nav className='Nav'>
        <div className='Nav-container'>

          <Link to='/' className='NavLogo' onClick={closeMenu}>
            Freelance Nexus
          </Link>

          <div className='menu-icon' onClick={menuClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>

          <ul className={click ? 'nav-menu active' : 'nav-menu'}>

            <li className='nav-link-tab'>
              {isLoggedIn && (
                <Link to='/profile' className='nav-links' onClick={closeMenu}>
                  Profile
                </Link>
              )}
            </li>

            {isLoggedIn && (
              <li className='nav-link-tab'>
                <Link to='/addpost' className='nav-links' onClick={closeMenu}>
                  Create Advert
                </Link>
              </li>
            )}

            <li className='nav-link-tab'>
              <Link to='/blackout' className='nav-links' onClick={closeMenu}>
                Support
              </Link>
            </li>

            {!isLoggedIn ? (
              <li>            
                <Link to='/register' className='nav-links-mobile' onClick={closeMenu}>
                  Register
                </Link>
              </li>
            ) : (
              <li>
                <button className='nav-links-mobile' onClick={logout}>
                  Logout
                </button>
              </li>
            )}

          </ul>

          {button && isLoggedIn && (
            <Button buttonStyle='btn--outline' onClick={logout}>
              Logout
            </Button>
          )}

          {button && !isLoggedIn && (
            <Link to='/register' className='nav-links' onClick={closeMenu}>
              <Button buttonStyle='btn--outline'>Register</Button>
            </Link>
          )}

          {/* All navigation tabs, logout and register button are rendered depending on if they have a token or not */}

        </div>
      </nav>
    </>
  );
}

export default Navigation;
