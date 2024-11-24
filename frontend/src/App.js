import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { ExploreSection } from './components/ExploreSection';
import { Topbar } from './components/Topbar';
import { AuthProvider } from './context/AuthContext';
import { ResetPassword } from './pages/ResetPassword';
import { ErrorNotification } from './components/ErrorNotification';
import { AdminForm } from './components/AdminForm';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  const [articles, setArticles] = useState([]);
  const [articleFetchMade, setArticleFetchMade] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error && errorDescription) {
        setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      }

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
                  <HeroSection
                    setArticles={setArticles}
                    setArticleFetchMade={setArticleFetchMade}
                  />
                  <ExploreSection
                    articles={articles}
                    setArticles={setArticles}
                    articleFetchMade={articleFetchMade}
                  />
                </>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
