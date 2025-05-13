import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Navbar from './components/Navbar';
import BarcodeScanner from './components/BarcodeScanner';
import Cart from './components/Cart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-md">
          {/* Header */}
          <div className="text-center my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ScanCart</h1>
            <p className="text-gray-600 max-w-xs mx-auto">
              Scan product barcodes to add them to your cart quickly and efficiently.
            </p>
          </div>
          
          {/* Scanner component */}
          <BarcodeScanner />
        </div>
      </main>
      
      {/* Cart component (slides in from the side) */}
      <Cart />
      
    </div>
  );
}

export default App;