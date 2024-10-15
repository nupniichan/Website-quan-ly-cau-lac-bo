// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import './styles/App.css';
function App() {
  return (
    <Router>
      <div className="app">
        {/* Sidebar and Header */}
        <Header />

        <div className="sidebar">
          <Sidebar />
        </div>

        <div className="content">
          <Routes>
            <Route path="*" element={<Navigate to="/" />} /> {/* Navigate 404 to home */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
