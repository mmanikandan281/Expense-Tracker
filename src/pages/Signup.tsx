import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, User, Mail, Lock, Eye, EyeOff, CheckCircle, MailOpen } from 'lucide-react';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signUp, user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        setError(error.message);
      } else {
        setSignupSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password.length >= 6;

  // Show verification message after successful signup
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <MailOpen className="h-8 w-8 text-success-600" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
          </div>
          
          {/* Verification Message */}
          <div className="card">
            <div className="p-6 text-center space-y-4">
              <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Check your inbox (and spam folder)</p>
                <p>• Click the verification link in the email</p>
                <p>• Return here to sign in</p>
              </div>
              
              <div className="pt-4">
                <Link 
                  to="/login" 
                  className="btn-primary w-full block text-center"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 ExpenseTracker. Secure authentication powered by Supabase | MkM.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center shadow-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Join ExpenseTracker</h1>
          <p className="text-gray-600">
            Create your account and start managing your finances today
          </p>
        </div>
        
        {/* Form */}
        <div className="card">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 text-center">Create Account</h2>
          </div>
          
          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}
            
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="form-label">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-accent-600" />
                  <span>Full Name</span>
                </div>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input pl-10"
                  placeholder="John Doe"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-accent-600" />
                  <span>Email address</span>
                </div>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input pl-10"
                  placeholder="you@example.com"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-accent-600" />
                  <span>Password</span>
                </div>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              <div className="flex items-center space-x-2 text-xs mt-1">
                {passwordStrength ? (
                  <div className="flex items-center space-x-1 text-success-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Password meets requirements</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Password must be at least 6 characters
                  </div>
                )}
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-accent-600" />
                  <span>Confirm Password</span>
                </div>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
            
            {/* Sign In Link */}
            <div className="text-center pt-3">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium transition-colors">
                  Sign in here
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 ExpenseTracker. Secure authentication powered by Supabase | MkM.
          </p>
        </div>
      </div>
    </div>
  );
};