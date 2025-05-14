import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BarcodeScanner from './components/BarcodeScanner';
import Cart from './components/Cart';
//verified Payment Gateway for PhonePe
function Success() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-green-500">Payment Successful!</h1>
    </div>
  );
}

function Failure() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">Payment Failed!</h1>
    </div>
  );
}

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ScanCart</h1>
            <p className="text-gray-600 max-w-xs mx-auto">
              Scan product barcodes to add them to your cart quickly and efficiently.
            </p>
          </div>
          <BarcodeScanner />
        </div>
      </main>
      <Cart />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment-success" element={<Success />} />
          <Route path="/payment-failure" element={<Failure />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
