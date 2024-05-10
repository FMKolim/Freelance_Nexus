import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import contextAuthentication from '../context/contextAuth';

function Login() {
  //calling login function from contextauthentication file
  const { login } = useContext(contextAuthentication);

  const loginfunction = (e) => {
    e.preventDefault();
    //getting the email and password to login with
    const email = e.target.email.value;
    const password = e.target.password.value;

    //call the login function
    email.length > 0 && login(email, password);
  };

  return (
    <div className='loginbox'>
      <form onSubmit={loginfunction}>

        <h1>Login</h1>

        <div className='input'>
          <input type='email' placeholder='Email' name='email' required />
        </div>

        <div className='input'>
          <input type='password' placeholder='Password' name='password' required />
        </div>

        <button type='submit'>Login</button>
        {/* After taking information in, after submitting data wll be sent to backend and if right user is logged in */}

        <div className='registerlink'>
          <p>Don't have an account? <Link to='/register'>Register here!</Link></p>
        </div>
        {/* Redirect to register page if clicked */}
      </form>
    </div>
  );
}

export default Login;
