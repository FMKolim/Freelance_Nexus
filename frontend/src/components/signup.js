import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './signup.css'
import contextAuthentication from '../context/contextAuth'

function Signup() {

  const[email, setemail] = useState("")
  const[username, setusername] = useState("")
  const[password, setpassword] = useState("")
  const[passwordtwo, setpasswordtwo] = useState("")
  const{register} = useContext(contextAuthentication)
  //Initialise state variables

  const registerfunction = (e) => {
    
    e.preventDefault()

    if(password !== passwordtwo){
     
      alert("Passwords don't match!")
      return
    }
    //If inputted passwords dont match throw out an error and do nothing

    register(email, username, password, passwordtwo)
    //Otherwise send all inputted information to the register function which will take care of the registering process

  }



  return (
    <div className='registerbox'>
      <form onSubmit={registerfunction}>
        <h1>Register</h1>

        <div className='input'>

          <input type='email' placeholder='Email' onChange={e => setemail(e.target.value)} required></input>

        </div>

        <div className='input'>

          <input type='text' placeholder='Username' onChange={e => setusername(e.target.value)} required></input>

        </div>

        <div className='input'>

          <input type='password' placeholder='Password' onChange={e => setpassword(e.target.value)} required></input>

        </div>

        <div className='input'>

          <input type='password' placeholder='Re-enter Password' onChange={e => setpasswordtwo(e.target.value)} required></input>

        </div>

        {/* All fields are required to be inputted and cant be submitted with any of them missing */}

        <button type='submit'>Register</button>

        <div className='loginlink'>

          <p>Have an account? <Link to='/login'>Login here!</Link></p>

          {/* Redirection link to login page if user already has an account */}
        </div>

      </form>


    </div>
  )
}

export default Signup
