import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCartStore } from "../../store/useCartStore";

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { items, getTotalPrice, clearCart } = useCartStore();

  // Get orderId and amount from query params
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  // Clear cart after invoice is generated (once, on mount)
  // useEffect(() => {
  //   if (items && items.length > 0) {
  //     clearCart();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Invoice</h2>
          <span className="text-3xl text-green-500">&#128179;</span>
        </div>
        <div className="mb-4">
          <div><strong>User:</strong> {user?.name || "Test"}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Order ID:</strong> {orderId}</div>
        </div>
        <table className="w-full mb-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? items.map((item: any) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">₹{item.price.toFixed(2)}</td>
                <td className="p-2 border">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-2 border text-center text-gray-400">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mb-2"><strong>Subtotal:</strong> ₹{((amount && !isNaN(Number(amount))) ? (Number(amount) / 100).toFixed(2) : "0.00")}</div>
        <div className="mb-2"><strong>Taxes:</strong> ₹0.00</div>
        <div className="mb-4 text-lg font-bold"><strong>Final Amount:</strong> ₹{((amount && !isNaN(Number(amount))) ? (Number(amount) / 100).toFixed(2) : "0.00")}</div>
        <div className="text-green-600 font-bold text-xl flex items-center">
          PAID <span className="ml-2">&#10004;</span>
        </div>
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Invoice;