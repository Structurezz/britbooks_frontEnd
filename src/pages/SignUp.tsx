import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Topbar from '../components/Topbar'; // Import Topbar as in AboutUs
import Footer from '../components/footer'; // Import Footer as in AboutUs

const EyeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.522-3.447-11.019-8.158l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.018,35.258,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
  </svg>
);

const PlusCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

// --- Password Strength Component ---
const PasswordStrengthMeter = ({ password }) => {
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
      case 0: return '';
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Okay';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  }, [getStrength]);

  const strengthColor = useMemo(() => {
    switch (getStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  }, [getStrength]);

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${(getStrength / 5) * 100}%` }}></div>
      </div>
      <span className="text-xs text-gray-500 w-24 text-right">{strengthLabel}</span>
    </div>
  );
};

// --- MAIN SIGNUP PAGE COMPONENT ---
const SignupPage = () => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      <Topbar />
      <div className="flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="w-full max-w-sm sm:max-w-lg">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold">Sign Up</h1>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                id="fullname" 
                name="fullname" 
                className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500" 
                required 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(!passwordVisible)} 
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-red-600"
                >
                  {passwordVisible ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <span>Strong Password:</span>
              <div className="group relative flex items-center">
                <PlusCircleIcon className="text-red-500 h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  - At least 8 characters
                  <br/>- One uppercase letter
                  <br/>- One number
                  <br/>- One special character
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-red-500"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} 
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-red-600"
                >
                  {confirmPasswordVisible ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <button 
                type="submit" 
                className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-all duration-300"
              >
                Create Account
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
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;