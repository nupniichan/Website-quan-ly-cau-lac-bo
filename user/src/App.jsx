
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
// import Homepage from './Homepage.jsx';
import AboutSchool from './AboutSchool.jsx';
// import ClubDetails from './ClubDetails.jsx';
// import CurriculumInfo from './Curriculum.jsx';
// import NewsDetails from './NewsDetails.jsx';
// import AdmissionStandard from './AdmissionStandard.jsx';
import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {


  return (
    <Router>
      <div className="app">
        <div className="header">
          <Header />
        </div>
        <div className="content">
          {/* <Routes>
            <Route path="/" element={<Navigate to="/" />} />
          </Routes> */}
          <AboutSchool/>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
