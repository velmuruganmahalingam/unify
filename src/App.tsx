/**
 * Main Application Component
 * Serves as the root component and implements the application's routing structure.
 * Integrates the plugin system and provides navigation between different pages.
 */

import './plugins';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';

/**
 * App Component
 * The root component of the application.
 * Features:
 * - React Router integration for navigation
 * - Basic navigation menu
 * - Route configuration for Home and Demo pages
 * - Plugin system initialization
 */
function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="p-4 bg-gray-100">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/demo">Demo</Link>
        </nav>

        {/* Route Configuration */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;