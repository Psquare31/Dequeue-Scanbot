import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCartStore } from "../../store/useCartStore";
import SendInvoice from "./SendInvoice";
import GenerateInvoice from "./GenerateInvoice";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth0();
  const { items, clearCart } = useCartStore();
//   if (isLoading) {
//   return <div>Loading...</div>; 
// }
  console.log("isAuthenticated:", isAuthenticated);
  // console.log("User:", user);
  

  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");


  const discount = 10;

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );


  const discountAmount = subtotal * (discount / 100);
  const totalAfterDiscount = subtotal - discountAmount;

  const products = items.map((item: any) => ({
    quantity: String(item.quantity),
    description: item.name,
    tax: 0,
    price: item.price,
  }));

  console.log(products);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full border border-gray-300 relative">
        
        <div className="flex flex-col items-center mb-6">
          <span className="text-3xl font-extrabold tracking-widest text-blue-700">DEQUEUE</span>
          <span className="text-xs text-gray-400 tracking-widest">INVOICE</span>
          <span className="mt-2 text-xs text-gray-500">Order ID: <span className="font-mono">{orderId}</span></span>
        </div>
        
        <div className="mb-4 text-xs text-gray-700">
          <div><span className="font-semibold">Name:</span> {user?.name || "Test"}</div>
          <div><span className="font-semibold">Email:</span> {user?.email}</div>
          <div><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</div>
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
            {items && items.length > 0 ? items.map((item: any) => (
              <tr key={item.id} className="text-center">
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
        
        <div className="flex flex-col gap-1 mb-4 text-xs">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="text-green-600">-₹{discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes (5%):</span>
            <span className="text-blue-400">+₹{(subtotal * 0.05).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-2">
            <span>Total:</span>
            <span>₹{totalAfterDiscount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <span className="bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-xs flex items-center gap-2">
            PAID <span className="text-lg">&#10004;</span>
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {clearCart(); navigate("/")} }
        >
          Back to Home
        </button>
        <div className="flex flex-row gap-2 justify-center">
          <SendInvoice
            orderId={orderId || ""}
            amount={totalAfterDiscount}
            email={user?.email || ""}
            products={products}
            buttonClass="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs px-4 py-2 rounded-full shadow transition"
          />
          <GenerateInvoice
            sender={{
              company: "Dequeue",
              country: "India",
            }}
            client={{
              company: user?.name || "Client",
              country: "India",
            }}
            products={products}
            invoiceNumber={orderId || "N/A"}
            invoiceDate={new Date().toLocaleDateString()}
            email={user?.email || ""}
            buttonClass="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-4 py-2 rounded-full shadow transition"
          />
        </div>
          
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(Invoice, {
  onRedirecting: () => <div>Loading...</div>,
});