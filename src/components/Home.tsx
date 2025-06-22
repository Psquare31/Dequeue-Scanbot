import React from "react";
import { FiUser } from "react-icons/fi";      // User icon
import { FiShoppingCart } from "react-icons/fi"; // Cart icon
import Navbar from "./Navbar";
import BarcodeScanner from "./BarcodeScanner";
import Cart from "./Cart";

function Home() {
  return (
    <>
    <main
      className="relative min-h-screen bg-cover bg-center flex flex-col justify-between"
      style={{
        backgroundImage: `url('/bg2.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#FFEFDF"
      }}
    >
      
      <Navbar/>
      {/* <div className="flex flex-col items-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Scan Cart</h1>
        <p className="text-lg text-gray-700 max-w-md mx-auto">
          Scan product barcodes to add them to your cart quickly and efficiently.
        </p>
      </div> */}

      
      <div className="w-full px-6 pb-6 flex justify-center absolute bottom-0 left-0">
        <BarcodeScanner/>
      </div>
      
    </main>
    <Cart/>
    </>
  );
}

export default Home;
