import React from "react";
import Navbar from "./Navbar";
import BarcodeScanner from "./BarcodeScanner";
import Cart from "./Cart";

function Home() {
  const [isMobile, setIsMobile] = React.useState(true);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {!isMobile && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ backgroundColor: "#FEF5E5"}}>
          <div className="text-8xl mb-44 font-extrabold tracking-widest text-red-600">DEQUEUE</div>
          <div className="text-3xl font-bold text-red-500 mb-4">Desktop Browsers are not Supported</div>
          <div className="text-xl text-gray-700 text-center max-w-s">
            This website is designed for smartphones.<br />
            Please open it on your mobile device for the best experience.
          </div>
        </div>
      )}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <main className="min-h-screen bg-[#FEF5E5] flex flex-col pt-[40px]">
        
        <div
          className="w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('/dequebg6858604e8e85f_png.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "#FEF5E5",
            backgroundSize: "98%",
            minHeight: "55vh",
          }}
        ></div>

        <div className="w-full flex items-center justify-center py-2 px-4 mt-[-24px]">
          <BarcodeScanner />
        </div>
      </main>

      <Cart />
    </>
  );
}

export default Home;
