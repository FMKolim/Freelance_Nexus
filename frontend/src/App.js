import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthenticationProvider } from './context/contextAuth';
import home from './components/home';
import login from './components/login';
import signup from './components/signup';
import Navigation from './components/Navigation';
import Footer from './components/footerContent';
import AddPost from './components/AddPost';
import Profile from './components/Profile';
import Blackout from './components/blackoutHome';
import PrivateRoute from './util/privRoute';
import "./App.css"
//Import all libraries and pages

const Reminder = ({ message }) => {
  return (
    <div className="reminder-box">
      <p>{message}</p>
    </div>
  );
};

//Reminder function, in charge of displayin the pop up messages

function App() {
  const [reminder, setReminder] = useState('');

  useEffect(() => {
    const reminderMessages = [
      'Take a short break and stretch those muscles!',
      'Remember to drink your water!',
      'It\'s time to rest your eyes and look away from your screen.',
      'Consider doing a quick meditation session.',
      'Take a moment to appreciate something around you.',
      'Did you eat anything yet? Keep that energy up!',
      'Take a break and clean up your room!',
      'Get some fresh air, go out on a walk!'
    ];
    //All messages stored in this variable

    const interval = setInterval(() => {

      const randomIndex = Math.floor(Math.random() * reminderMessages.length);

      setReminder(reminderMessages[randomIndex]);

      setTimeout(() => {

        setReminder('');

      }, 6000);

    }, 420000); 
    //After 7 minute intervals a reminder message will be shown for 6 seconds

    return () => clearInterval(interval);
    //clearinterval stops the timer from running
  }, []);

  return (
    <Router>
      <AuthenticationProvider>
        <Navigation />
        {reminder && <Reminder message={reminder} />}
        <Switch>

          <Route component={login} path="/login" exact />

          <Route component={signup} path="/register" exact />

          <Route component={home} path="/home" exact />

          <PrivateRoute component={AddPost} path="/addpost" exact />

          <PrivateRoute component={Profile} path="/profile" exact />

          <Route component={Blackout} path="/blackout" exact />
          {/* All routes, some privates for users only */}

          <Route>
            <Redirect to="/home" />
          </Route>
          {/* If user tries to access a non existant page through url will be redirected to home */}

        </Switch>

        <Footer /> 
        {/* Footer component shown on every page */}

      </AuthenticationProvider>

    </Router>
  );
}

export default App;
