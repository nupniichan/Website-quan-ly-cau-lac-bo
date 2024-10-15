import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';
import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImage from './assets/react.svg'; // Update this path

function App() {
  return (
    <Router>
      <div className="app relative">
        <div className="header">
          <Header />
        </div>

        {/* Image positioned on top of the header and navbar */}
        <div className="image-container">
          <img src={logoImage} alt="Logo" className="logo" /> {/* Logo Image */}
        </div>

        <div className="navbar">
          <Navbar />
        </div>
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        <div className="footer">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
