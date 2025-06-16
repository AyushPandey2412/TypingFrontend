// import { useState } from 'react';
// import axios from 'axios';

// function Signup() {
//   const [sInfo, setSInfo] = useState({
//     username: '',
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSInfo({ ...sInfo, [name]: value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const { username, email, password } = sInfo;
//     if (!username || !email || !password) {
//       console.log('All fields are required');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:4000/signup', sInfo);

//       if (response.data.success) {
//         console.log('Signup successful:', response.data);
//       } else {
//         console.log('Signup failed:', response.data.message);
//       }
//     } catch (err) {
//       console.error('Signup error:', err.response ? err.response.data : err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Signup</h1>
//       <form onSubmit={handleSignup}>
//         <div>
//           <label htmlFor="username">Username</label>
//           <input
//             onChange={handleChange}
//             type="text"
//             name="username"
//             autoFocus
//             placeholder="Username"
//             value={sInfo.username}
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             onChange={handleChange}
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={sInfo.email}
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             onChange={handleChange}
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={sInfo.password}
//           />
//         </div>
//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// }

// export default Signup;



import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, X, UserPlus } from "lucide-react";

const Signup = ({ onSuccess, onCancel, onSwitchToLogin }) => {
  const [sInfo, setSInfo] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSInfo({ ...sInfo, [name]: value });
    if (error) setError(""); // Clear error when user starts typing
    if (success) setSuccess(""); // Clear success message when user starts typing
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password } = sInfo;

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Replace this with your actual axios call
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sInfo)
      });
      
      const data = await response.json();

      if (data.success) {
        console.log("Signup successful:", data);
        setSuccess("Account created successfully! You can now sign in.");
        
        // Clear form
        setSInfo({
          username: "",
          email: "",
          password: ""
        });

        // Call onSuccess if provided (for modal usage)
        if (onSuccess) {
          setTimeout(() => {
            onSuccess({
              id: data.userId || 1,
              name: username,
              email: email
            });
          }, 1500); // Show success message briefly before closing
        }
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRoute = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      // Replace with your routing logic
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 relative">
        {/* Close button for modal */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join us and start typing faster</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
            <p className="text-green-400 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                onChange={handleChange}
                type="text"
                name="username"
                id="username"
                autoFocus
                placeholder="Choose a username"
                value={sInfo.username}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                onChange={handleChange}
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={sInfo.email}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Create a password"
                value={sInfo.password}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleSignup(e)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="border-t border-gray-600 flex-1"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="border-t border-gray-600 flex-1"></div>
          </div>

          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={handleLoginRoute}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Terms Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Terms of Service</span>{" "}
            and{" "}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;