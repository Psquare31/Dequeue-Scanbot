import { useEffect, useState } from "react";
import ScanbotSDK from "scanbot-web-sdk/ui";
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  barcode: string;
}

const App = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [scanStatus, setScanStatus] = useState<"success" | "error" | "">(""); // NEW
  const { addItem, openCart } = useCartStore();


  useEffect(() => {
    const init = async () => {
      try {
        await ScanbotSDK.initialize({
          licenseKey: "", // Add your Scanbot license key here
          enginePath: "/wasm/"
        });
      } catch (error) {
        console.error("Failed to initialize Scanbot SDK", error);
      }
    };
    init();
  }, []);

  const fetchProductDetails = async (barcode: string) => {
    try {
      const response = await fetch(`/api/products/${barcode}`);
      if (!response.ok) throw new Error("Product not found");

      const data = await response.json();
      setProduct(data);
      setScanStatus("success");

      console.log(data);
      addItem(data); //add product to cart

      const audio = new Audio('/success-sound.mp3');
      audio.play().catch(() => {});

      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } catch (err) {
      console.error(err);
      setProduct(null);
      setScanStatus("error");
    }
  };


  const startScanner = async () => {
    try {
      const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
      const result = await ScanbotSDK.UI.createBarcodeScanner(config);
      if (result && result.items.length > 0) {
        const barcode = result.items[0].barcode.text;
        setScanResult(barcode);
        console.log(barcode);
        await fetchProductDetails(barcode);
      }
    } catch (error) {
      console.error("Scanner error", error);
    }
  };

   const viewCart = () => {
    openCart();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <button onClick={startScanner} className="bg-green-600 text-white px-4 py-2 rounded mt-4">
        Start Scanner
      </button>

      {scanResult && <p className="mt-4 text-sm">Scanned Barcode: {scanResult}</p>}

      {product && (
        <div className="mt-4 text-left">
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
        </div>
      )}


      <div className="mt-6 w-full flex justify-center">
        {scanStatus === "success" && product && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs bg-white p-4 rounded-lg shadow-lg flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 7 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <p className="text-sm font-medium text-green-800">Added to cart!</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{product.name}</p>
            <p className="text-md text-gray-600">${product.price.toFixed(2)}</p>
          </motion.div>
        )}

        {scanStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs bg-white p-4 rounded-lg shadow-lg flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 7 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <p className="text-lg font-medium text-red-600 text-center">No product Found!</p>
            <p className="text-sm text-gray-500 mt-2 text-center">Try scanning a different barcode</p>
          </motion.div>
        )}
      </div>



      <div className="mt-6 w-full flex flex-col items-center space-y-3">
        <p className="text-sm text-gray-600 text-center px-4">
          Point your camera at a product barcode to scan it and add to your cart.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={viewCart}
          className="w-full max-w-xs bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          View Cart
        </motion.button>
      </div>
    </div>
  );
};

export default App;
