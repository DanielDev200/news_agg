import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { ExploreSection } from './components/ExploreSection';
import { Topbar } from './components/Topbar';
import { DesktopWarningModal } from './components/DesktopWarningModal';
import { AppProvider } from './context/AppContext';
import { ResetPassword } from './pages/ResetPassword';
import { ErrorNotification } from './components/ErrorNotification';
import { AdminUI } from './components/AdminUI';
import { SignInPage } from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage'; 
import { About } from './pages/About';
import { AddYourCity } from './pages/AddYourCity';
import { Stats } from './pages/Stats';
import { Account } from './pages/Account';
import ProtectedRoute from './utils/ProtectedRoute';

function AppContent() {
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const [articles, setArticles] = useState([]);
  const [articleFetchMade, setArticleFetchMade] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsReadyToShow(true);
    }, 500);

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

  const location = useLocation();

  if (location.pathname === '/signin') {
    return <SignInPage/>
  }

  if (location.pathname === '/signup') {
    return <SignUpPage/>
  }

  return (
    <div>
      <Topbar />
      <DesktopWarningModal />
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
      {
        isReadyToShow && (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection
                    setArticles={setArticles}
                    articles={articles}
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
                  <AdminUI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={<About />}
            />
            <Route
              path="/addyourcity"
              element={<AddYourCity />}
            />
            <Route
              path="/stats"
              element={<Stats />}
            />
            <Route
              path="/account"
              element={<Account />}
            />
          </Routes>
        )
      }
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
