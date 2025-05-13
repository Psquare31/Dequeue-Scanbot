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
  const openCart = useCartStore((state) => state.openCart);

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
    } catch (err) {
      console.error(err);
      setProduct(null);
      alert("Product not found or error fetching details");
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

      <div className="mt-6 w-full flex flex-col items-center space-y-3">
        <p className="text-sm text-gray-600 text-center px-4">
          Point your camera at a product barcode to scan it and add to your cart.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openCart}
          className="w-full max-w-xs bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          View Cart
        </motion.button>
      </div>
    </div>
  );
};

export default App;
