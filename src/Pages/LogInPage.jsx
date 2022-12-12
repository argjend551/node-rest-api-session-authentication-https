import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import '../scss/App.scss';

export default function LogInPage({ loggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [showWrongLogin, setWrongLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  let navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/myProfile');
    }
  }, [loggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login();
    }
  };

  function login() {
    fetch('https://127.0.0.1:4000/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const message = data.message ? data.message : data.error;
        const type = data.loggedIn ? 'success' : 'danger';
        setMessage({
          text: message,
          type: type,
        });

        setWrongLogin(true);
        if (type == 'success') {
          setWrongLogin(false);

          setLoading(true);

          setTimeout(() => {
            navigate('/myProfile');
          }, 2000);
        }
      });
  }

  return (
    <div className='login'>
      {showWrongLogin && (
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
      <div className='login-container'>
        <div className='Heading'>
          {loading ? <h1>Logging in...</h1> : <h1>Login</h1>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              style={{ textAlign: 'start' }}
              type='email'
              className='form-control'
              aria-describedby='emailHelp'
              placeholder='Email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className='form-group'>
            <input
              style={{ textAlign: 'start' }}
              type='password'
              className='form-control'
              placeholder='Password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className='form-group'>
            {loading ? (
              <div className='spinner-border' role='status'></div>
            ) : (
              <button
                className='login-btn'
                variant='primary'
                type='submit'
                onClick={login}
              >
                Login
              </button>
            )}
          </div>
        </form>
        <div>
          {!loading ? (
            <Link to={'/register'}>
              <button className='register-btn' style={{ margin: '5px' }}>
                Create new account
              </button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
