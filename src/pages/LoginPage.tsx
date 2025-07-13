import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import TopBar from '../components/Topbar';  // ✅ Import TopBar
import Footer from '../components/footer';  // ✅ Import Footer

const EyeIcon = (props) => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.522-3.447-11.019-8.158l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.018,35.258,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 
      4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 
      1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 
      1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
    />
  </svg>
);

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await mockLogin({ email, password });

      if (response.success) {
        login(response.user);
        toast.success('Login successful! Welcome to BritBooks.');
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 1500);
      } else {
        setLoading(false);
        toast.error('Invalid email or password');
      }
    } catch (err) {
      setLoading(false);
      toast.error('An error occurred. Please try again.');
    }
  };

  const mockLogin = async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (email === 'aloysius@choicetextile.com' && password === 'password123') {
      return {
        success: true,
        user: { fullName: 'Aloysius Choicetextile' },
      };
    }
    return { success: false };
  };

  const handleGoogleLogin = () => {
    toast('Google login not implemented yet');
  };

  const handleFacebookLogin = () => {
    toast('Facebook login not implemented yet');
  };

  return (
    <>
      <TopBar /> {/* ✅ Top bar */}
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <Toaster position="top-right" />
        <div className="bg-white w-full max-w-md p-8 md:p-12 rounded-xl shadow-lg">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-red-600 text-white font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-md">B</div>
              <span className="text-3xl font-bold">BritBooks</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={loading}
              />
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-red-600"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {passwordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-right mt-4">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors space-x-2"
                disabled={loading}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors space-x-2"
                disabled={loading}
              >
                <FacebookIcon />
                <span>Continue with Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer /> {/* ✅ Footer */}
    </>
  );
};

export default LoginPage;
