import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ClubManagement from './ClubManagement.jsx'; // Import the ClubManagement component
import './styles/App.css';
import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import AddClub from './AddClub.jsx';
function App() {
  const [selectedContent, setSelectedContent] = useState('club-management');

  const handleSidebarNavigation = (content) => {
    setSelectedContent(content);
  };

  return (
    <Router>
      <div className="app">
        <div className="header">
          <Header />
        </div>
        <div className="sidebar">
          <Sidebar selectedContent={selectedContent} onNavigate={handleSidebarNavigation} />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="/club-management" element={<ClubManagement />} />
            <Route path="/add-club" element={<AddClub />} />
            {/* <Route path="/edit-club/:id" element={<EditClub />} />  */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
