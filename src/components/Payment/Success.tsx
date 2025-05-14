import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, items, amount, orderId } = location.state || {};

  const {clearCart} = useCartStore();
  
  useEffect(() => {
    clearCart();
    console.log("Cart cleared");
  }, [clearCart]);

  if (!user || !items) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">No invoice data found.</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-600">Payment Successful</h2>
          <span className="text-3xl text-green-500">&#10004;</span>
        </div>
        <div className="mb-4">
          <div><strong>User:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
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
            {items.map((item: any) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">₹{item.price.toFixed(2)}</td>
                <td className="p-2 border">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mb-2"><strong>Subtotal:</strong> ₹{(amount / 100).toFixed(2)}</div>
        <div className="mb-2"><strong>Taxes:</strong> ₹0.00</div>
        <div className="mb-4 text-lg font-bold"><strong>Final Amount:</strong> ₹{(amount / 100).toFixed(2)}</div>
        <div className="text-green-600 font-bold text-xl flex items-center">
          PAID <span className="ml-2">&#10004;</span>
        </div>
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;