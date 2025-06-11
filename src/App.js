import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import HeroSelectionPage from './HeroSelectionPage';
import RewardsPage from './RewardsPage';
import NavigationPage from './NavigationPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/translator" />} />
          <Route path="/translator" element={<HeroSelectionPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;