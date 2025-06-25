import React from "react";
import Navbar from "./Navbar";
import BarcodeScanner from "./BarcodeScanner";
import Cart from "./Cart";

function Home() {
  return (
    <>
     
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <main className="min-h-screen bg-[#FEF5E5] flex flex-col pt-[70px]">
        
        <div
          className="mt-6 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('/dequebg6858604e8e85f_png.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "#FEF5E5",
            backgroundSize: "99%",
            minHeight: "70vh",
          }}
        ></div>

        <div className="w-full flex items-center justify-center py-2 px-4 mt-[-12px]">
          <BarcodeScanner />
        </div>
      </main>

      <Cart />
    </>
  );
}

export default Home;
