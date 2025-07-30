import React, { useState, useMemo, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { RegisterFormData, VerifyFormData, JwtPayload } from "../types/auth";
import Topbar from "../components/Topbar";
import Footer from "../components/footer";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

// Reused icons (unchanged)
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.522-3.447-11.019-8.158l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.018,35.258,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
  </svg>
);

const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const getStrength = useMemo(() => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 7) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (getStrength) {
      case 0:
        return "";
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Okay";
      case 4:
        return "Good";
      case 5:
        return "Strong";
      default:
        return "";
    }
  }, [getStrength]);

  const strengthColor = useMemo(() => {
    switch (getStrength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  }, [getStrength]);

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${(getStrength / 5) * 100}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 w-24 text-right">{strengthLabel}</span>
    </div>
  );
};

const SignupPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  const { auth, registerUser, verifyRegistration } = context;
  const { loading, error, token } = auth;

  const navigate = useNavigate();

  useEffect(() => {
    if (token && !showVerificationModal) {
      console.log("Token updated in context:", token);
      setShowVerificationModal(true);
    }
  }, [token, showVerificationModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null);
    localStorage.setItem("signupEmail", e.target.name === "email" ? e.target.value : formData.email);
  };

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;

    if (!formData.fullName.trim()) {
      setFormError("Full name is required.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      setFormError("Please enter a valid phone number (e.g., +2341234567890).");
      return false;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      toast.error(formError || "Please correct the form errors.");
      return;
    }

    console.log("Sending registration request:", formData);
    try {
      await registerUser({ ...formData, role: "user" });
      localStorage.setItem("signupEmail", formData.email);
      if (!auth.error) {
        console.log("Registration successful. Token:", auth.token);
        if (auth.token) {
          try {
            const decoded = jwtDecode<JwtPayload>(auth.token);
            console.log("Registration token payload:", decoded);
          } catch (e) {
            console.error("Failed to decode registration token:", e);
          }
        }
        console.log("Waiting for verification...");
      } else {
        console.error("Registration failed:", auth.error);
        toast.error(auth.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleVerifySubmit triggered. Code:", verifyCode, "Token:", token);
    if (!verifyCode || !/^\d{6}$/.test(verifyCode)) {
      console.log("Invalid code:", verifyCode);
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    if (!token) {
      console.log("No token available for verification");
      toast.error("No authentication token available. Please try registering again.");
      setShowVerificationModal(false);
      return;
    }

    try {
      await verifyRegistration({ code: verifyCode });
      if (!auth.error) {
        console.log("Registration verification successful");
        setShowVerificationModal(false);
        setVerifyCode("");
        localStorage.removeItem("signupEmail");
        toast.success("Registration verified successfully!");
        navigate("/");
      } else {
        console.error("Registration verification failed:", auth.error);
        toast.error(auth.error || "Verification failed. Please try again.");
        if (auth.error === "Incomplete registration token payload.") {
          toast.error("Invalid token. Please try registering again.");
          setShowVerificationModal(false);
          navigate("/signup");
        }
      }
    } catch (err) {
      console.error("Registration verification error:", err);
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    console.log("Closing verification modal");
    setShowVerificationModal(false);
    setVerifyCode("");
    localStorage.removeItem("signupEmail");
  };

  const emailDisplay = (() => {
    let email = localStorage.getItem("signupEmail") || formData.email;
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log("Decoded JWT payload:", decoded);
        email = decoded.email || email;
      } catch (e) {
        console.error("Failed to decode JWT:", e);
      }
    }
    if (!email) {
      console.log("No valid email available");
      return "your email or phone number";
    }
    return email;
  })();

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      <Toaster position="top-right" />
      <Topbar />
      <div className="flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="w-full max-w-sm sm:max-w-lg">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold">Sign Up</h1>
          </div>

          {(error || formError) && (
            <div className="text-red-500 text-center mb-4">{error || formError}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                placeholder="+2341234567890"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-red-600"
                >
                  {passwordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <PasswordStrengthMeter password={formData.password} />
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <span>Strong Password:</span>
              <div className="group relative flex items-center">
                <PlusCircleIcon className="text-red-500 h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  - At least 8 characters
                  <br />- One uppercase letter
                  <br />- One number
                  <br />- One special character
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-red-600"
                >
                  {confirmPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <GoogleIcon />
                <span className="ml-2">Sign Up with Google</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 bg-blue-800 text-white rounded-md font-semibold hover:bg-blue-900 transition-colors"
              >
                <FacebookIcon />
                <span className="ml-2">Sign Up with Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verify Your Account</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code sent to your email or phone number ({emailDisplay}).
            </p>
            <form onSubmit={handleVerifySubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SignupPage;