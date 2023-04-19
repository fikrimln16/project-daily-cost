import { GoogleLogin, GoogleLogout } from 'react-google-login';
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const clientId = '698995087265-ke7pal05ogph7ikc5oae490eosn566on.apps.googleusercontent.com';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLoginSuccess = (response) => {
    setIsLoggedIn(true);
    setUserInfo(response.profileObj);
  };

  const handleLoginFailure = (response) => {
    console.log('Login failed:', response);
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const handleLogoutFailure = (response) => {
    console.log('Logout failed:', response);
  };

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth.init({clientId:clientId})
        })
    }, []);


  return (
    <div>
      {isLoggedIn ? (
        <>
          <Navigate to='/table'/>
        </>
      ) : (
        <GoogleLogin
          clientId={clientId}
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          buttonText="Login with Google"
        />
      )}
    </div>
  );
}

export default App;
