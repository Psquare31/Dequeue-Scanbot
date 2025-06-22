import { useEffect, useState, useRef } from "react";
import ScanbotSDK from "scanbot-web-sdk/ui";
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import type { Product, ScannerStatus } from '../types';

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [scanStatus, setScanStatus] = useState<ScannerStatus>('inactive');
  const { addItem, openCart } = useCartStore();

  const scannedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scanResult && scannedRef.current) {
      scannedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scanResult]);

  useEffect(() => {
    const init = async () => {
      try {
        await ScanbotSDK.initialize({
          licenseKey: "",
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
    const text = await response.text();
    console.log("Raw response text:", text);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${text}`);
    }

    const parsed = JSON.parse(text);
    const productData = parsed.data; // <-- get the actual product object

    const product: Product = {
      ...productData,
      id: productData._id, // map _id to id
    };

    setProduct(product);
    setScanStatus("success");
    addItem(product);

    const audio = new Audio('/success-sound.mp3');
    audio.play().catch(() => {});
    if ('vibrate' in navigator) navigator.vibrate(200);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    setProduct(null);
    setScanStatus("error");
  }
};





  const startScanner = async () => {
    if (scanStatus === 'scanning') return;
    setScanStatus('scanning');
    setProduct(null);
    setScanResult("");

    try {
      const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
      const result = await ScanbotSDK.UI.createBarcodeScanner(config);
      if (result?.items.length > 0) {
        const barcode = result.items[0].barcode.text;
        setScanResult(barcode);
        await fetchProductDetails(barcode);
      }
    } catch (error) {
      console.error("Scanner error", error);
      setScanStatus("inactive");
    }
  };

  const stopScanning = () => {
    setScanStatus('inactive');
    setProduct(null);
    setScanResult("");
  };

  const viewCart = () => openCart();

  return (
  <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 py-8">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={scanStatus === 'scanning' ? stopScanning : startScanner}
        className={`mt-8 w-44 h-14 rounded-full font-medium text-white shadow transition-colors ${
          scanStatus === 'scanning' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
      {scanStatus === 'scanning' ? 'Stop' : 'Scan'}
    </motion.button>

    <div ref={scannedRef} className="w-full">
        {scanResult && (
          <p className="mt-4 text-sm text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full">
            Scanned: {scanResult}
          </p>
        )}

    <div className="mt-6 w-full flex justify-center">
      {scanStatus === "success" && product && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 px-5 text-center"
      >
        <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 8 }}
        className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-3"
        >
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        </motion.div>
        <p className="text-green-700 font-semibold">Added to Cart</p>
        <p className="text-lg font-bold text-gray-800 mt-1">{product.name}</p>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </motion.div>
      )}

      {scanStatus === "error" && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-5 px-7 text-center"
      >
        <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 8 }}
        className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-3"
        >
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        </motion.div>
        <p className="text-red-600 font-semibold">No product found</p>
        <p className="text-sm text-gray-500 mt-2">Try scanning another barcode</p>
      </motion.div>
      )}
    </div>
  </div>
  </div>
);
};

export default BarcodeScanner;
