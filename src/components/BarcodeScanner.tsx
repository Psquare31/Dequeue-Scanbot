import { useEffect, useState, useRef } from "react";
import ScanbotSDK from "scanbot-web-sdk/ui";
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuth0 } from '@auth0/auth0-react';
import type { Product, ScannerStatus, ApiResponse } from '../types';
import Rec_product from "./Rec_product";

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [scanStatus, setScanStatus] = useState<ScannerStatus>('inactive');
  const { addItem, openCart } = useCartStore();
  const { user, isAuthenticated } = useAuth0();
  const [showRecommendations, setShowRecommendations] = useState(false);
  // Removed manualInputOpen state as manual entry is now inline
  const [manualBarcode, setManualBarcode] = useState("");

  const productRef = useRef<HTMLDivElement>(null);

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

      const parsed: ApiResponse<Product> = JSON.parse(text);

      if (!parsed.success) {
        throw new Error(parsed.message || "Failed to fetch product");
      }

      const productData = parsed.data;

      const product: Product = {
        ...productData,
        id: productData._id,
      };

      setProduct(product);
      setScanStatus("success");
      
      // Add item with user context if authenticated
      if (isAuthenticated && user) {
        await addItem(product, user.sub, user.name, user.email);
      } else {
        await addItem(product);
      }
      
      setShowRecommendations(true);

      setTimeout(() => {
        document.getElementById("scanned-product")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);

      const audio = new Audio('/success-sound.mp3');
      audio.play().catch(() => {});
      if ('vibrate' in navigator) navigator.vibrate(200);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setProduct(null);
      setScanStatus("error");
      setShowRecommendations(false);
    }
  };

  const startScanner = async () => {
    if (scanStatus === 'scanning') return;
    setScanStatus('scanning');
    setProduct(null);
    setScanResult("");
    setShowRecommendations(false);

    try {
      const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
      const result = await ScanbotSDK.UI.createBarcodeScanner(config);
      if (result && result.items && result.items.length > 0) {
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
    setShowRecommendations(false);
  };

  const viewCart = () => openCart();

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      setManualInputOpen(false);
      setScanResult(manualBarcode);
      await fetchProductDetails(manualBarcode);
      setManualBarcode("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-2 sm:px-4 py-8 overflow-x-hidden">

      <div className="flex flex-col items-center mt-3 mb-8 w-full">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={scanStatus === 'scanning' ? stopScanning : startScanner}
          className={`w-40 h-12 rounded-full font-medium text-white shadow transition-colors ${
            scanStatus === 'scanning' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {scanStatus === 'scanning' ? 'Stop' : 'Scan'}
        </motion.button>

        {/* Manual entry placeholder below scan button */}
        <div className="w-full max-w-xs mt-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-2 font-serif">Having trouble scanning?</span>
          <form onSubmit={handleManualSubmit} className="w-full flex flex-col text-xs items-center gap-2" style={{letterSpacing: '0.05em'}}>
            <div className="relative w-full">
              <input
                type="text"
                value={manualBarcode}
                onChange={e => setManualBarcode(e.target.value)}
                className="w-full h-11 pl-12 pr-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all placeholder-gray-400"
                placeholder="Enter barcode manually"
                style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
              />
            
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7v10M17 7v10M11 7v10M13 7v10"/></svg>
              </span>
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-full bg-red-500 text-white font-medium shadow transition-colors hover:bg-red-600 mt-1"
              disabled={!manualBarcode.trim()}
              style={{letterSpacing: '0.01em'}}
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
      {/* ...existing code... (removed obsolete modal closing parenthesis) */}

      <div ref={productRef} className="w-full">
        {scanResult && (
          <p className="mt-4 text-sm text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full">
            Scanned: {scanResult}
          </p>
        )}

        <div className="mt-6 w-full flex flex-col items-center gap-6">
          {scanStatus === "success" && product && (
            <div id="scanned-product" className="w-full px-2 sm:px-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 px-5 text-center mx-auto"
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

              
              {showRecommendations && (
                <div className="mt-6 w-full overflow-x-auto px-1">
                  <Rec_product />
                </div>
              )}
            </div>
          )}

          {scanStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-5 px-7 text-center mx-auto"
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
