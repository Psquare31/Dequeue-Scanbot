import React from "react";
import Navbar from "./Navbar";
import BarcodeScanner from "./BarcodeScanner";
import Cart from "./Cart";
//Verify alignment change
function Home() {
  return (
    <>
      <main className="min-h-screen bg-[#FFEFDF] flex flex-col">
        {/* Background section */}
        <div
          className="w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('/bg2.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "#FFEFDF",
            minHeight: "75vh",
          }}
        >
          <Navbar />
        </div>

        
        <div className="w-full flex items-center justify-center py-10 px-4">
          <BarcodeScanner />
        </div>
      </main>

      <Cart />
    </>
  );
}

export default Home;
