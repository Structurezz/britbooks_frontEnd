"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

// --- SVG ICONS ---
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CreditCardIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// --- MOCK DATA ---
const initialCartItems = [
  { id: 1, title: 'The Stardust Thief', author: 'Chelsea Abdullah', price: 18.99, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1631541333l/58983556.jpg', quantity: 1 },
  { id: 2, title: 'Lessons in Chemistry', author: 'Bonnie Garmus', price: 15.50, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1634768234l/58065033.jpg', quantity: 1 },
];

// --- COMPONENTS ---

// Step 1: Shopping Cart
const ShoppingCart = ({ cartItems, setCartItems, goToNextStep }) => {
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-on-scroll">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-start space-x-6 bg-white p-4 rounded-lg shadow-sm">
              <img src={item.imageUrl} alt={item.title} className="w-24 h-36 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">by {item.author}</p>
                <p className="text-lg font-semibold text-red-600 mt-2">£{item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between h-36">
                <div className="flex items-center border rounded-md">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg font-bold">-</button>
                  <span className="px-4 py-1 border-l border-r">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg font-bold">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="flex items-center text-sm text-gray-500 hover:text-red-600">
                  <TrashIcon className="w-4 h-4 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between"><p>Subtotal</p><p>£{subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Shipping</p><p>£{shipping.toFixed(2)}</p></div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg"><p>Total</p><p>£{total.toFixed(2)}</p></div>
          </div>
          <button onClick={goToNextStep} className="w-full mt-8 bg-red-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Payment Information
const PaymentForm = ({ goToNextStep }) => {
  const [activeTab, setActiveTab] = useState('credit-card');

  return (
    <div className="max-w-2xl mx-auto animate-on-scroll">
      <h2 className="text-3xl font-bold text-center mb-8">Payment Information</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="flex border-b">
            <button onClick={() => setActiveTab('credit-card')} className={`py-2 px-4 font-semibold ${activeTab === 'credit-card' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}>
              <CreditCardIcon className="inline-block mr-2 h-5 w-5" />Credit/Debit Card
            </button>
            <button onClick={() => setActiveTab('paypal')} className={`py-2 px-4 font-semibold ${activeTab === 'paypal' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}>PayPal</button>
          </div>
        </div>
        {activeTab === 'credit-card' && (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input type="text" placeholder="Card Number" className="w-full mt-1 p-3 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input type="text" placeholder="Oonepted" className="w-full mt-1 p-3 border rounded-md" />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                <input type="text" placeholder="MM/YY" className="w-full mt-1 p-3 border rounded-md" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input type="text" placeholder="CVV" className="w-full mt-1 p-3 border rounded-md" />
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500"><LockIcon className="mr-2" /> Accepted</div>
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2">Billing Address</h3>
              <label className="flex items-center space-x-2">
                <input type="radio" name="billingAddress" className="form-radio text-red-600" defaultChecked />
                <span>Previously shipping address</span>
              </label>
            </div>
            <button onClick={goToNextStep} type="button" className="w-full mt-4 bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-black">
              Continue to Review
            </button>
          </form>
        )}
        {activeTab === 'paypal' && (
          <div className="text-center py-8">
            <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
            <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full">
              Pay with PayPal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 3: Review and Place Order
const ReviewOrder = ({ cartItems, goToPreviousStep }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="max-w-3xl mx-auto animate-on-scroll">
      <h2 className="text-3xl font-bold text-center mb-8">Review & Place Order</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
            <p className="text-gray-600">John Doe<br />123 Bookworm Lane<br />London, W1A 1AA<br />United Kingdom</p>
            <button onClick={goToPreviousStep} className="text-blue-600 text-sm mt-2 hover:underline">Change</button>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Payment Method</h3>
            <p className="text-gray-600">Mastercard ending in 1234</p>
            <button onClick={goToPreviousStep} className="text-blue-600 text-sm mt-2 hover:underline">Change</button>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h3 className="font-bold text-lg mb-4">Items in Order</h3>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <p>{item.title} (x{item.quantity})</p>
                <p>£{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 border-t pt-6 space-y-2">
          <div className="flex justify-between"><p>Subtotal</p><p>£{subtotal.toFixed(2)}</p></div>
          <div className="flex justify-between"><p>Shipping</p><p>£{shipping.toFixed(2)}</p></div>
          <div className="flex justify-between font-bold text-xl"><p>Total</p><p>£{total.toFixed(2)}</p></div>
        </div>
        <button className="w-full mt-8 bg-red-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-700">
          Place Order
        </button>
      </div>
    </div>
  );
};

// --- Main Checkout Flow Component ---
const CheckoutFlow = () => {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [activeLink, setActiveLink] = useState('checkout');

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
    <div className="flex h-screen bg-gray-50 font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />

      <div className="flex-1 flex flex-col ml-64">
        <TopBar steps={[{ number: 1, name: 'Shopping Cart' }, { number: 2, name: 'Payment' }, { number: 3, name: 'Review & Place Order' }]} currentStep={step} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {step === 1 && <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} goToNextStep={() => setStep(2)} />}
            {step === 2 && <PaymentForm goToNextStep={() => setStep(3)} />}
            {step === 3 && <ReviewOrder cartItems={cartItems} goToPreviousStep={() => setStep(2)} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutFlow;