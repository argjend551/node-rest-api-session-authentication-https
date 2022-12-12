import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import '../scss/App.scss';

export default function MyProfilePage({ setLoginParent }) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLogin] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  let navigate = useNavigate();

  useEffect(() => {
    getMyProfile();
  }, []);

  function getMyProfile() {
    fetch('https://127.0.0.1:4000/api/myProfile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
        setLogin(data.loggedIn);
        setLoginParent(data.loggedIn);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  function logout() {
    fetch('https://127.0.0.1:4000/api/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage({
          text: data.message,
          type: 'Success',
        });
        setShowMessage(true);
        navigate('/');
      })
      .catch((error) => {
        setMessage({
          text: error.message,
          type: 'Danger',
        });
      });
  }

  return (
    <div
      className='login'
      style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}
    >
      {showMessage && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
          }}
        >
          <Alert variant={message.type}>{message.text}</Alert>
        </div>
      )}
      {loggedIn ? (
        <>
          <h1>Welcome {user.name}!</h1>
          <p>Email: {user.username}</p>
          <p>Name: {user.name}</p>
          <button className='login-btn' onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <p>Please log in to view your profile</p>
          <button className='login-btn' onClick={() => navigate(`/`)}>
            Login
          </button>
        </>
      )}
      {''}
    </div>
  );
}
