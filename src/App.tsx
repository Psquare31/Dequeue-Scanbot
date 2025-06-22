import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Invoice from './components/Payment/Invoice';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fc] text-gray-800 font-inter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
