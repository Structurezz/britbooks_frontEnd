import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, CreditCard, Lock } from "lucide-react";
import { MD5 } from "crypto-js"; // For generating unique seeds
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe with Vite environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const API_BASE_URL = "https://britbooks-api-production.up.railway.app/api";

// --- Helper Function for Placeholder Images ---
const generatePlaceholderImage = (book: { title: string; isbn: string; genre: string }): string => {
  // Create a hash from ISBN or title to use as a seed for Picsum
  const input = book.isbn || book.title;
  const hash = MD5(input).toString().slice(0, 8); // Use first 8 chars of MD5 hash

  // Map genre to a keyword for visual distinction
  const genreColors: Record<string, string> = {
    Mindfulness: "zen",
    Technology: "tech",
    Psychology: "psych",
    "Self-Help": "selfhelp",
    Mystery: "mystery",
    "Contemporary Fiction": "fiction",
    Drama: "drama",
    Biography: "bio",
    Leadership: "lead",
    "Asian Literature": "asianlit",
    Entrepreneurship: "entrepreneur",
    Poetry: "poetry",
    Humor: "humor",
    History: "history",
    Cookbooks: "cook",
    Art: "art",
    Comics: "comics",
    default: "default",
  };

  const genreKey = genreColors[book.genre] || genreColors.default;

  // Use Lorem Picsum with the hash as a seed for unique images
  return `https://picsum.photos/seed/${hash}-${genreKey}/300/450`;
};

// --- Checkout Stepper Component ---
const CheckoutStepper = ({ currentStep }: { currentStep: number }) => {
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
                    isActive ? "bg-red-600 text-white shadow-lg" : isCompleted ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : stepNumber}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold ${isActive || isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 sm:mx-4 ${isCompleted ? "bg-yellow-400" : "bg-gray-200"}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// --- Shopping Cart View Component ---
const ShoppingCartView = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  goToNextStep,
}: {
  cartItems: any[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  goToNextStep: () => void;
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace("£", "")) * item.quantity, 0);
  const shipping = 5.0;
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-on-scroll">
      <div className="lg:col-span-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
            <Link to="/category" className="text-red-600 hover:underline mt-4 inline-block">
              Continue Shopping
            </Link>
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
                  {cartItems.map((item) => {
                    const [imageError, setImageError] = useState(false);
                    const fallbackImage = "https://placehold.co/300x450?text=Book+Cover";
                    const displayImage = imageError
                      ? fallbackImage
                      : item.imageUrl || generatePlaceholderImage({ title: item.title, isbn: item.isbn || "", genre: item.genre || "default" });

                    return (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <img
                              src={displayImage}
                              alt={item.title}
                              className="w-16 sm:w-20 h-20 sm:h-24 object-cover rounded"
                              onError={() => setImageError(true)}
                              loading="lazy"
                            />
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
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 sm:px-3 py-1 text-sm sm:text-base font-bold text-gray-700"
                            >
                              -
                            </button>
                            <span className="px-3 sm:px-4 py-1 border-l border-r border-gray-300 text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 sm:px-3 py-1 text-sm sm:text-base font-bold text-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 font-bold text-sm sm:text-base text-gray-800">
                          £{(parseFloat(item.price.replace("£", "")) * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-3 sm:p-4">
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                            <X size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <Link
                to="/category"
                className="bg-gray-200 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md text-center text-sm sm:text-base hover:bg-gray-300"
              >
                CONTINUE SHOPPING
              </Link>
              <button
                onClick={clearCart}
                className="bg-gray-200 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md text-sm sm:text-base hover:bg-gray-300"
              >
                CLEAR SHOPPING CART
              </button>
            </div>
          </>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sticky top-20 sm:top-28">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Order Summary</h3>
          <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>£{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>£{shipping.toFixed(2)}</p>
            </div>
            <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg text-gray-800">
              <p>TOTAL</p>
              <p>£{total.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={goToNextStep}
            className="w-full mt-6 sm:mt-8 bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
            disabled={cartItems.length === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Payment Form Component ---
const PaymentForm = ({
  goToNextStep,
  setPaymentData,
}: {
  goToNextStep: () => void;
  setPaymentData: (data: any) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState<"credit-card" | "paypal">("credit-card");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    line1: "",
    city: "",
    phoneNumber: "",
    postalCode: "",
    country: "GB",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      const { token, error: stripeError } = await stripe.createToken(cardElement);

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      setPaymentData({
        token: token.id,
        shippingAddress,
      });

      goToNextStep();
    } catch (err) {
      setError("Failed to process payment details. Please try again.");
      console.error("Payment form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-on-scroll">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8">Payment Information</h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="mb-4 sm:mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("credit-card")}
              className={`py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base ${
                activeTab === "credit-card" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-red-600"
              }`}
            >
              <CreditCard className="inline-block mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Credit/Debit Card
            </button>
            <button
              onClick={() => setActiveTab("paypal")}
              className={`py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base ${
                activeTab === "paypal" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-red-600"
              }`}
            >
              PayPal
            </button>
          </div>
        </div>
        {activeTab === "credit-card" && (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={shippingAddress.line1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={shippingAddress.phoneNumber}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
                className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Details</label>
              <CardElement
                className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#a0aec0" },
                    },
                    invalid: { color: "#e53e3e" },
                  },
                }}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Lock className="mr-2 w-4 h-4" /> Secure Payment
            </div>
            <button
              type="submit"
              className="w-full mt-4 sm:mt-6 bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
              disabled={loading || !stripe}
            >
              {loading ? "Processing..." : "CONTINUE TO REVIEW"}
            </button>
          </form>
        )}
        {activeTab === "paypal" && (
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

// --- Review Order Component ---
const ReviewOrder = ({
  cartItems,
  goToPreviousStep,
  paymentData,
  setPaymentData,
}: {
  cartItems: any[];
  goToPreviousStep: () => void;
  paymentData: any;
  setPaymentData: (data: any) => void;
}) => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace("£", "")) * item.quantity, 0);
  const shipping = 5.0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!auth.token) {
      setError("Please log in to place an order.");
      navigate("/login");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const decoded = jwtDecode<{ userId: string }>(auth.token);
      const userId = decoded.userId;
      const orderId = `ORDER_${Date.now()}`;
      const items = cartItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price.replace("£", "")),
      }));

      console.log("Sending Token to Backend:", paymentData.token);
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-payment`,
        {
          userId,
          email: auth.user.email,
          orderId,
          shippingAddress: paymentData.shippingAddress,
          items,
          subtotal,
          shippingFee: shipping,
          total,
          currency: "gbp",
          token: paymentData.token,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      console.log("Create Payment Response:", response.data);
      const { clientSecret, reference, status, requiresAction, nextAction, receiptUrl } = response.data;

      if (requiresAction) {
        const stripe = await stripePromise;
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

        if (confirmError) {
          setError(confirmError.message);
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          console.log("Calling Success Endpoint:", `${API_BASE_URL}/payments/success/${paymentIntent.id}`, {
            reference: paymentIntent.id,
            receiptUrl: receiptUrl || null,
          });
          const successResponse = await axios.post(
            `${API_BASE_URL}/payments/success/${paymentIntent.id}`,
            { reference: paymentIntent.id, receiptUrl: receiptUrl || null },
            { headers: { Authorization: `Bearer ${auth.token}` } }
          );

          console.log("Success Endpoint Response:", successResponse.data);
          if (successResponse.data.success) {
            clearCart();
            setPaymentData(null);
            navigate("/order-confirmation", { state: { orderId, receiptUrl: receiptUrl || null } });
          } else {
            setError(successResponse.data.message || "Failed to process payment success response. Please try again.");
          }
        } else {
          setError("Payment is pending. Please check your email for confirmation.");
        }
      } else if (status === "succeeded") {
        console.log("Calling Success Endpoint:", `${API_BASE_URL}/payments/success/${reference}`, {
          reference,
          receiptUrl: receiptUrl || null,
        });
        const successResponse = await axios.post(
          `${API_BASE_URL}/payments/success/${reference}`,
          { reference, receiptUrl: receiptUrl || null },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        console.log("Success Endpoint Response:", successResponse.data);
        if (successResponse.data.success) {
          clearCart();
          setPaymentData(null);
          navigate("/orders", { state: { orderId, receiptUrl: receiptUrl || null } });
        } else {
          setError(successResponse.data.message || "Failed to process payment success response. Please try again.");
        }
      } else {
        setError("Payment is pending. Please check your email for confirmation.");
      }
    } catch (err: any) {
      console.error("Place order error:", err.response?.data || err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to process payment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-on-scroll">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8">Review & Place Order</h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Shipping Address</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {paymentData.shippingAddress.name}
              <br />
              {paymentData.shippingAddress.line1}
              <br />
              {paymentData.shippingAddress.city}, {paymentData.shippingAddress.postalCode}
              <br />
              {paymentData.shippingAddress.country}
            </p>
            <button onClick={goToPreviousStep} className="text-red-600 text-xs sm:text-sm mt-2 hover:underline">
              Change
            </button>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Payment Method</h3>
            <p className="text-gray-600 text-sm sm:text-base">Card ending in ****</p>
            <button onClick={goToPreviousStep} className="text-red-600 text-xs sm:text-sm mt-2 hover:underline">
              Change
            </button>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-6">
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Items in Order</h3>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {cartItems.map((item) => {
              const [imageError, setImageError] = useState(false);
              const fallbackImage = "https://placehold.co/300x450?text=Book+Cover";
              const displayImage = imageError
                ? fallbackImage
                : item.imageUrl || generatePlaceholderImage({ title: item.title, isbn: item.isbn || "", genre: item.genre || "default" });

              return (
                <div key={item.id} className="flex items-center justify-between py-2 text-sm sm:text-base text-gray-700">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={displayImage}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded"
                      onError={() => setImageError(true)}
                      loading="lazy"
                    />
                    <p>
                      {item.title} (x{item.quantity})
                    </p>
                  </div>
                  <p>£{(parseFloat(item.price.replace("£", "")) * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6 space-y-2 text-sm sm:text-base text-gray-700">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>£{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>£{shipping.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg text-gray-800">
            <p>Total</p>
            <p>£{total.toFixed(2)}</p>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 sm:mt-8 bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Processing..." : "PLACE ORDER"}
        </button>
      </div>
    </div>
  );
};

// --- Main Checkout Flow Component ---
const CheckoutFlow = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
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
          {step === 1 && (
            <ShoppingCartView
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              goToNextStep={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Elements stripe={stripePromise}>
              <PaymentForm goToNextStep={() => setStep(3)} setPaymentData={setPaymentData} />
            </Elements>
          )}
          {step === 3 && (
            <ReviewOrder
              cartItems={cartItems}
              goToPreviousStep={() => setStep(2)}
              paymentData={paymentData}
              setPaymentData={setPaymentData}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutFlow;