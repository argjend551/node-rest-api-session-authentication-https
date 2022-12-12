import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from './Pages/LogInPage';
import RegisterPage from './Pages/RegisterPage';
import MyProfilePage from './Pages/MyProfilePage';
import MissingPage from './Pages/MissingPage';
import './scss/App.scss';

export default function App() {
  const [loggedIn, setLogin] = useState(false);
  useEffect(() => {
    function getMyProfile() {
      fetch('https://127.0.0.1:4000/api/myProfile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setLogin(data.loggedIn);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
    getMyProfile();
  }, []);

  return (
    <>
      <Router>
        <main>
          <Routes>
            <Route
              path='/myProfile'
              element={<MyProfilePage setLoginParent={setLogin} />}
            />
            <Route path='/' element={<LogInPage loggedIn={loggedIn} />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/*' element={<MissingPage />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}
