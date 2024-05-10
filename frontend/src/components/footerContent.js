import React from 'react';
import './Footer.css';
import footerBackground from './pictures/nexus_logo.jpg';
import { Link } from 'react-router-dom';

//Footer compoments that's rendered at the bottom of each page

function FooterContent() {

  const token = localStorage.getItem('AuthenticationToken');

  // Initialize variables related to authentication
  let accessToken = null;
  let dec = null;

  // Check if token is available and decode it
  if (token) {
    const parsedToken = JSON.parse(token);
    accessToken = parsedToken.access;
  }

  
  return (

    <div className='Footer_Tab'>

      <div className='Footer_Column'>
        
        {accessToken ? (

          <Link to='/profile' className='NavLogo'>

            Profile
            {/* If the user is logged in the profile link will redirect to profile page */}

          </Link>

        ) : (

          <span className='NavLogo' onClick={() => alert('Can\'t access profile if not logged in!')} style={{ cursor: 'pointer' }}>

            Profile
            {/* If user doesn't have a token an alert will be shown saying they can't access the profile tab */}

          </span>

        )}

      </div>

      <div className='Footer_Column'>

        <Link to='/blackout' className='NavLogo'>

          Support

        </Link>

      </div>

      <div className='Footer_Column'>

        <Link to = '/home'>

          <img src={footerBackground} alt='Nexus Logo' className='Footer_Image' />
          {/* Image component that when clicked will redirect to home */}

        </Link>

      </div>

    </div>
  );
}

export default FooterContent;
