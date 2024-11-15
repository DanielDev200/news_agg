import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { ExploreSection } from './components/ExploreSection';
import { Topbar } from './components/Topbar';
import { AuthProvider } from './context/AuthContext';
import { ResetPassword } from './pages/ResetPassword';
import { ErrorNotification } from './components/ErrorNotification';

function App() {
  const [articles, setArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check for error messages in the URL hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error && errorDescription) {
        setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      }

      // Clear the hash from the URL after extracting the message
      window.history.replaceState(null, null, ' ');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <Topbar />
          {errorMessage && (
            <ErrorNotification
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection setArticles={setArticles} />
                  <ExploreSection articles={articles} />
                </>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
