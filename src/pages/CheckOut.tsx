import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, CreditCard, Lock } from 'lucide-react';
import TopBar from '../components/Topbar';
import Footer from '../components/footer';
import { useCart } from '../context/cartContext';

// --- Checkout Stepper Component ---
const CheckoutStepper = ({ currentStep }) => {
  const steps = ["Shopping Cart", "Checkout", "Order Complete"];
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-12 animate-on-scroll">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-300 ${
                    isActive ? 'bg-red-600 text-white shadow-lg' : isCompleted ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : stepNumber}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{step}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 sm:mx-4 ${isCompleted ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// --- Shopping Cart View ---
const ShoppingCartView = ({ cartItems, updateQuantity, removeFromCart, clearCart, goToNextStep }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('£', '')) * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-on-scroll">
      <div className="lg:col-span-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
            <Link to="/category" className="text-red-600 hover:underline mt-4 inline-block">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold text-sm text-gray-600">PRODUCT</th>
                    <th className="p-3 sm:p-4 font-semibold text-sm text-gray-600">PRICE</th>
                    <th className="p-3 sm:p-4 font-semibold text-sm text-gray-600">QUANTITY</th>
                    <th className="p-3 sm:p-4 font-semibold text-sm text-gray-600">TOTAL</th>
                    <th className="p-3 sm:p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img src={item.img} alt={item.title} className="w-16 sm:w-20 h-20 sm:h-24 object-cover rounded" />
                          <div>
                            <p className="font-semibold text-sm sm:text-base text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 font-semibold text-sm sm:text-base text-gray-800">{item.price}</td>
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => {
                              console.log(`Decrease quantity for ${item.id}, current: ${item.quantity}`);
                              updateQuantity(item.id, item.quantity - 1);
                            }} 
                            className="px-2 sm:px-3 py-1 text-sm sm:text-base font-bold text-gray-700"
                          >
                            -
                          </button>
                          <span className="px-3 sm:px-4 py-1 border-l border-r border-gray-300 text-sm sm:text-base">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              console.log(`Increase quantity for ${item.id}, current: ${item.quantity}`);
                              updateQuantity(item.id, item.quantity + 1);
                            }} 
                            className="px-2 sm:px-3 py-1 text-sm sm:text-base font-bold text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-sm sm:text-base text-gray-800">£{(parseFloat(item.price.replace('£', '')) * item.quantity).toFixed(2)}</td>
                      <td className="p-3 sm:p-4">
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <Link to="/category" className="bg-gray-200 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md text-center text-sm sm:text-base hover:bg-gray-300">CONTINUE SHOPPING</Link>
              <button onClick={clearCart} className="bg-gray-200 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md text-sm sm:text-base hover:bg-gray-300">CLEAR SHOPPING CART</button>
            </div>
          </>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sticky top-20 sm:top-28">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Order Summary</h3>
          <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
            <div className="flex justify-between"><p>Subtotal</p><p>£{subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Shipping</p><p>£{shipping.toFixed(2)}</p></div>
            <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg text-gray-800"><p>TOTAL</p><p>£{total.toFixed(2)}</p></div>
          </div>
          <button onClick={goToNextStep} className="w-full mt-6 sm:mt-8 bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors" disabled={cartItems.length === 0}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Payment Information ---
const PaymentForm = ({ goToNextStep }) => {
  const [activeTab, setActiveTab] = useState('credit-card');

  return (
    <div className="max-w-2xl mx-auto animate-on-scroll">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8">Payment Information</h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="mb-4 sm:mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('credit-card')}
              className={`py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base ${activeTab === 'credit-card' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <CreditCard className="inline-block mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Credit/Debit Card
            </button>
            <button
              onClick={() => setActiveTab('paypal')}
              className={`py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base ${activeTab === 'paypal' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              PayPal
            </button>
          </div>
        </div>
        {activeTab === 'credit-card' && (
          <form className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                placeholder="Card Number"
                className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500"><Lock className="mr-2 w-4 h-4" /> Secure Payment</div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-4 mb-2">Billing Address</h3>
              <label className="flex items-center space-x-2">
                <input type="radio" name="billingAddress" className="form-radio text-red-600" defaultChecked />
                <span className="text-sm sm:text-base text-gray-700">Use shipping address</span>
              </label>
            </div>
            <button
              onClick={goToNextStep}
              type="button"
              className="w-full mt-4 sm:mt-6 bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
            >
              CONTINUE TO REVIEW
            </button>
          </form>
        )}
        {activeTab === 'paypal' && (
          <div className="text-center py-6 sm:py-8">
            <p className="mb-4 text-sm sm:text-base text-gray-700">You will be redirected to PayPal to complete your payment.</p>
            <button className="bg-blue-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base hover:bg-blue-700 transition-colors">
              PAY WITH PAYPAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Review and Place Order ---
const ReviewOrder = ({ cartItems, goToPreviousStep }) => {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('£', '')) * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    navigate('/payment');
  };

  return (
    <div className="max-w-3xl mx-auto animate-on-scroll">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8">Review & Place Order</h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Shipping Address</h3>
            <p className="text-gray-600 text-sm sm:text-base">John Doe<br />123 Bookworm Lane<br />London, W1A 1AA<br />United Kingdom</p>
            <button onClick={goToPreviousStep} className="text-red-600 text-xs sm:text-sm mt-2 hover:underline">Change</button>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Payment Method</h3>
            <p className="text-gray-600 text-sm sm:text-base">Mastercard ending in 1234</p>
            <button onClick={goToPreviousStep} className="text-red-600 text-xs sm:text-sm mt-2 hover:underline">Change</button>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-6">
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Items in Order</h3>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 text-sm sm:text-base text-gray-700">
                <p>{item.title} (x{item.quantity})</p>
                <p>£{(parseFloat(item.price.replace('£', '')) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6 space-y-2 text-sm sm:text-base text-gray-700">
          <div className="flex justify-between"><p>Subtotal</p><p>£{subtotal.toFixed(2)}</p></div>
          <div className="flex justify-between"><p>Shipping</p><p>£{shipping.toFixed(2)}</p></div>
          <div className="flex justify-between font-bold text-base sm:text-lg text-gray-800"><p>Total</p><p>£{total.toFixed(2)}</p></div>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 sm:mt-8 bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

// --- Main Checkout Flow Component ---
const CheckoutFlow = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans flex-col">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <TopBar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          <CheckoutStepper currentStep={step} />
          {step === 1 && <ShoppingCartView cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} goToNextStep={() => setStep(2)} />}
          {step === 2 && <PaymentForm goToNextStep={() => setStep(3)} />}
          {step === 3 && <ReviewOrder cartItems={cartItems} goToPreviousStep={() => setStep(2)} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutFlow;