import React, { useRef, useEffect, useState } from 'react';
import Header from './components/Header.tsx';
import HomePage from './pages/HomePage.tsx';
import Footer from './components/Footer.tsx';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, BrowserRouter } from 'react-router-dom';
import { useAccount } from "@starknet-react/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import './skeleton.css';
import Page1 from './pages/page1.tsx';
import Page2 from './pages/page2.tsx';
import Page3 from './pages/page3.tsx';

const App: React.FC = () => {
  return (
    <main>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='page1' element={<Page1 />}/>
        <Route path='page2' element={<Page2 />}/>
        <Route path='page3' element={<Page3 />}/>
      </Routes>
      <Footer />
    </main>
  );
};

export default App;