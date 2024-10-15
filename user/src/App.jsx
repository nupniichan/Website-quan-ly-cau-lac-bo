<<<<<<< HEAD
import { useState } from 'react'
import Header from './Header'
import Homepage from './Homepage'
import ClubDetails from './ClubDetails'
import ClubList from './ClubList'
import NewsDetails from './NewsDetails'
import AdmissionStandard from './AdmissionStandard'
import AboutSchool from './AboutSchool'
import Curriculum from './Curriculum'
import InternationalCooperation from './InternationalCooperation'
function App() {
  return (
    <>
    <Header/>
    <InternationalCooperation/>
    </>
  )
=======

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import './App.css';
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
>>>>>>> 73005224a4181e3e2a7111dedb4c3887f7058cc9
}

export default App;
