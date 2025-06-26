import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCartStore } from "../../store/useCartStore";
import { purchaseHistoryUtils } from "../../utils/purchaseHistoryUtils";
import SendInvoice from "./SendInvoice";
import GenerateInvoice from "./GenerateInvoice";
import { withAuthenticationRequired } from "@auth0/auth0-react";

interface PurchaseHistoryItem {
  _id: string;
  name: string;
  price: number;
  discount: number;
  barcode: string;
  image_url?: string;
  description?: string;
  quantity: number;
  rating?: number;
  review?: string;
  category: string;
}

interface PurchaseHistory {
  _id: string;
  userId: string;
  name: string;
  email: string;
  items: PurchaseHistoryItem[];
  amount: number;
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth0();
  const { items, clearCart } = useCartStore();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const discount = 10;

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (orderId) {
        try {
          setLoading(true);
          const response = await purchaseHistoryUtils.getPurchaseHistoryByOrderId(orderId);
          if (response.success) {
            setPurchaseHistory(response.data);
          }
        } catch (error) {
          console.error('Error fetching purchase history:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [orderId]);

  console.log("isAuthenticated:", isAuthenticated);
  console.log("User:", user);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading invoice...</div>;
  }

  if (!purchaseHistory) {
    return <div className="flex items-center justify-center min-h-screen">Purchase history not found</div>;
  }

  const subtotal = purchaseHistory.items.reduce(
    (sum: number, item: PurchaseHistoryItem) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = subtotal * (discount / 100);
  const totalAfterDiscount = subtotal - discountAmount;

  const products = purchaseHistory.items.map((item: PurchaseHistoryItem) => ({
    quantity: String(item.quantity),
    description: item.name,
    tax: 0,
    price: item.price,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoice</h1>
          <p className="text-gray-600">Order ID: {purchaseHistory.orderId}</p>
          <p className="text-gray-600">Date: {new Date(purchaseHistory.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
            <p className="text-gray-700">{purchaseHistory.name}</p>
            <p className="text-gray-700">{purchaseHistory.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">From:</h3>
            <p className="text-gray-700">Dequeue</p>
            <p className="text-gray-700">123 Main Street</p>
            <p className="text-gray-700">City, State 12345</p>
          </div>
        </div>

        <table className="w-full mb-4 border border-gray-200 rounded font-mono text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border-b">Item</th>
              <th className="p-2 border-b">Qty</th>
              <th className="p-2 border-b">Price</th>
              <th className="p-2 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.items && purchaseHistory.items.length > 0 ? purchaseHistory.items.map((item: PurchaseHistoryItem) => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border-b">{item.name}</td>
                <td className="p-2 border-b">{item.quantity}</td>
                <td className="p-2 border-b">₹{item.price.toFixed(2)}</td>
                <td className="p-2 border-b">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-2 border-b text-center text-gray-400">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-700 font-semibold">Discount:</span>
          <span className="text-xs text-gray-700">{discount}%</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-700 font-semibold">Total:</span>
          <span className="text-xs text-gray-700">₹{totalAfterDiscount.toFixed(2)}</span>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {clearCart(user?.sub); navigate("/")} }
          >
            Back to Home
          </button>
          <div className="flex flex-row gap-2 justify-center">
            <SendInvoice
              orderId={purchaseHistory.orderId}
              amount={totalAfterDiscount}
              email={purchaseHistory.email}
              buttonClass="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs px-4 py-2 rounded-full shadow transition"
            />
            <GenerateInvoice
              sender={{
                company: "Dequeue",
                country: "India",
              }}
              client={{
                company: purchaseHistory.name,
                country: "India",
              }}
              products={products}
              invoiceNumber={purchaseHistory.orderId}
              invoiceDate={new Date(purchaseHistory.createdAt).toLocaleDateString()}
              email={purchaseHistory.email}
              buttonClass="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-4 py-2 rounded-full shadow transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(Invoice);