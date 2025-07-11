import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuth0 } from "@auth0/auth0-react";
import {toast,Toaster} from 'react-hot-toast';
import type { CartItem, RazorpayHandlerResponse, RazorpayOrderData, RazorpayVerifyResponse } from '../types';
import { useNavigate } from 'react-router-dom';



const Cart: React.FC = () => {
const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
    setLastOrderId
  } = useCartStore();    
  
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  const DISCOUNT_PERCENT = 10;
  const TAX_PERCENT = 5; 
//verify amount type fix
  const subtotal = getTotalPrice();
  const discountAmount = subtotal * (DISCOUNT_PERCENT / 100);
  const taxedAmount = (subtotal) * (TAX_PERCENT / 100);
  const total = Number((subtotal - discountAmount + taxedAmount).toFixed(2));
    
    //handlePayment Function
    const handlePayment = async () => {

      if (!isAuthenticated) {
        loginWithRedirect()
      return;
    }

     const amount = total;

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
                        // Finalize purchase history after successful payment
                        if (user && user.sub) {
                          try {
                            setLastOrderId(data.id);
                            // Finalize the existing draft purchase history
                            await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL_Rec}/api/purchase-history/user/${encodeURIComponent(user.sub)}/finalize`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                orderId: data.id
                              })
                            });

                          } catch (e) {
                            console.error('Error finalizing purchase history:', e);
                          }
                        }
                        
                        navigate(`/invoice?orderId=${data.id}&amount=${data.amount}`);
                        toast.success(verifyData.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
    }

    // Patch removeItem and addItem to pass userId
    const handleRemoveItem = async (id: string) => {
      if (user && user.sub) {
        await removeItem(id, user.sub);
        // Optionally, trigger recommendations update here
      } else {
        await removeItem(id);
      }
    };

    // Handle quantity updates with user context
    const handleUpdateQuantity = async (id: string, quantity: number) => {
      if (user && user.sub) {
        await updateQuantity(id, quantity, user.sub);
      } else {
        await updateQuantity(id, quantity);
      }
    };

    // Handle cart clearing with user context
    const handleClearCart = async () => {
      if (user && user.sub) {
        await clearCart(user.sub);
      } else {
        await clearCart();
      }
    };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeCart}
          />

          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            
            <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart size={24} className="text-red-500 mr-2" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button onClick={closeCart} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
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
                      onRemove={() => handleRemoveItem(item.id)}
                      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
  {items.length > 0 && (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-medium">Subtotal:</span>
        <span className="text-md font-bold">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Discount ({DISCOUNT_PERCENT}%):</span>
        <span className="text-sm text-green-600">-₹{discountAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Taxes ({TAX_PERCENT}%):</span>
        <span className="text-sm text-blue-600">+₹{taxedAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center mb-4 font-bold text-lg">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </>
  )}

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
                    : 'bg-red-500 text-white hover:bg-red-700'
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
      <img src={item.image_url || '/Product.jpg'} alt={item.name} className="w-full h-full object-cover" />
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
