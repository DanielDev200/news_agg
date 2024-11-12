import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { ExploreSection } from './components/ExploreSection';
import { Topbar } from './components/Topbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  // Define a state to hold articles
  const [articles, setArticles] = useState([]);

  return (
    <AuthProvider>
      <div>
        <Topbar />
        {/* Pass setArticles function to HeroSection */}
        <HeroSection setArticles={setArticles} />
        {/* Pass articles to ExploreSection */}
        <ExploreSection articles={articles} />
      </div>
    </AuthProvider>
  );
}

export default App;
