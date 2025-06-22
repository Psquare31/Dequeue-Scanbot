import React from "react";
import Navbar from "./Navbar";
import BarcodeScanner from "./BarcodeScanner";
import Cart from "./Cart";
//Verify alignment change
function Home() {
  return (
    <>
      <main className="min-h-screen bg-[#FEF5E5] flex flex-col">
        {/* Background section */}
        <div
          className="mt-12 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('/dequebg6858604e8e85f_png.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "#FEF5E5",
            backgroundSize: "99%",
            minHeight: "70vh",
          }}
        >
          <Navbar />
        </div>

        
        <div className="w-full flex items-center justify-center py-2 px-4">
          <BarcodeScanner />
        </div>
      </main>

      <Cart />
    </>
  );
}

export default Home;
