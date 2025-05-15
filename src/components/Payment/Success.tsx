import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, items, amount, orderId } = location.state || {};
  const { clearCart } = useCartStore();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // 1. Optionally verify payment
        await axios.post('/api/confirm-payment', { orderId });

        // 2. Save purchase history
        await axios.post('https://deque-scanbot-backend.vercel.app/api/purchase-history', {
          userId: user?.sub,
          name: user?.name,
          email: user?.email,
          items,
          amount,
          orderId,
        });

        // 3. Generate invoice
        await axios.post('https://deque-scanbot-backend.vercel.app/api/generate-invoice', {
          userId: user?.sub,
          orderId,
        });

        // 4. Clear the cart
        clearCart();

        // 5. Redirect after 2 seconds
        setTimeout(() => navigate('/orders'), 2000);
      } catch (err) {
        // Handle errors (optional: show toast)
        console.error('Payment post-processing failed:', err);
      }
    };

    if (user && items && orderId) {
      handlePaymentSuccess();
    }
  }, [user, items, amount, orderId, clearCart, navigate]);

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
        <div className="mb-2"><strong>Subtotal:</strong> ₹{(amount || 0).toFixed(2)}</div>
        <div className="mb-2"><strong>Taxes:</strong> ₹0.00</div>
        <div className="mb-4 text-lg font-bold"><strong>Final Amount:</strong> ₹{(amount || 0).toFixed(2)}</div>
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