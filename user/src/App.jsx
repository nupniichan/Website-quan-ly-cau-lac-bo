import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';
import logoImage from '../public/imgs/logo.png';
import Homepage from './Homepage.jsx';
import AboutSchool from './AboutSchool.jsx';
import ClubList from './ClubList.jsx';
import ClubDetails from './ClubDetails.jsx';
import CurriculumInfo from './Curriculum.jsx';
import NewsDetails from './NewsDetails.jsx';
import AdmissionStandard from './AdmissionStandard.jsx';
import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import InternationalCooperation from './InternationalCooperation.jsx';
import ICDetails from './ICDetails.jsx';
function App() {
  return (
    <Router>
      <div className="app relative">
        <div className="header">
          <Header />
        </div>

        {/* Image positioned on top of the header and navbar */}
        <div className="image-container">
          <img src={logoImage} alt="Logo" className="logo"/> {/* Logo Image */}
        </div>

        <div className="navbar">
          <Navbar />
        </div>
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutSchool />} />
            <Route path="/clubs" element={<ClubList />} />
            <Route path="/clubs/:clubId" element={<ClubDetails />} />
            <Route path="/curriculum" element={<CurriculumInfo />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/international-cooperation" element={<InternationalCooperation />} />
            <Route path="/international-cooperation/:id" element={<ICDetails />} />
            <Route path="/admission" element={<AdmissionStandard />} />
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
