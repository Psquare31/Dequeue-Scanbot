import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuth0 } from "@auth0/auth0-react";
import {toast,Toaster} from 'react-hot-toast';
import type { CartItem, RazorpayHandlerResponse, RazorpayOrderData, RazorpayVerifyResponse } from '../types';


const Cart: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCartStore();    
  
  const { loginWithRedirect } = useAuth0();
  const { isAuthenticated } = useAuth0();

    
    //handlePayment Function
    const handlePayment = async () => {

      if (!isAuthenticated) {
        loginWithRedirect()
      return;
    }

     const amount = getTotalPrice();

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    amount
                })
            });

            const data = await res.json();
            console.log(data);
            handlePaymentVerify(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    //handlePaymentVerify Function
    const handlePaymentVerify = async (data: RazorpayOrderData) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Dequeue",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response: RazorpayHandlerResponse) => {
              // clearCart();
                console.log("response", response)
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData: RazorpayVerifyResponse = await res.json();

                    if (verifyData.success) {
                        window.location.href = `/invoice?orderId=${data.id}&amount=${data.amount}`;
                        toast.success(verifyData.message);
                        clearCart();
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }
 
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeCart}
          />

          {/* Cart panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart size={24} className="text-blue-600 mr-2" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button onClick={closeCart} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart size={64} className="text-gray-300 mb-4" />
                  <p className="text-lg text-gray-500 font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Scan products to add them to your cart</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
              </div>

              {/* <button
                onClick={clearCart}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mb-4">
                  Pay
                </button> */}
          
              <button
                onClick={handlePayment}
                disabled={items.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  items.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors shadow-md`}
              >
                {isAuthenticated ? 'Checkout' : 'Login to Checkout'}
              </button>

              <Toaster
                position="top-center"
                reverseOrder={false}/>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface CartItemComponentProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onRemove,
  onUpdateQuantity
}) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, height: 0 }}
    className="flex items-center p-3 border border-gray-200 rounded-lg"
  >
    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-xs">No image</span>
        </div>
      )}
    </div>

    <div className="ml-3 flex-1">
      <h4 className="text-sm font-medium">{item.name}</h4>
      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
    </div>

    <div className="flex flex-col items-center border border-gray-200 rounded">
      <button onClick={() => onUpdateQuantity(item.quantity + 1)} className="p-1 hover:bg-gray-100">
        <ChevronUp size={16} />
      </button>
      <span className="text-sm font-medium px-2">{item.quantity}</span>
      <button
        onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
        className="p-1 hover:bg-gray-100"
        disabled={item.quantity <= 1}
      >
        <ChevronDown size={16} />
      </button>
    </div>

    <button onClick={onRemove} className="ml-3 p-2 text-gray-400 hover:text-red-500">
      <Trash2 size={18} />
    </button>
  </motion.li>
);

export default Cart;




  