// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   const [loginInfo, setLoginInfo] = useState({
//     username: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo({ ...loginInfo, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { username, password } = loginInfo;

//     if (!username || !password) {
//       console.log("All fields are required");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:4000/login", loginInfo);
//       const { success, message, jwttoken, userId, profilePicture } = response.data;

//       if (success) {
//         console.log("Login successful:", message);

//         localStorage.setItem("token", jwttoken);
//         localStorage.setItem("loggedInUser", username);
//         localStorage.setItem("userId", userId);
//         localStorage.setItem("profilePicture", profilePicture);

//         navigate("/");
//       } else {
//         console.log("Login failed:", message);
//       }
//     } catch (err) {
//       console.error("Login error:", err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="username">Username</label>
//           <input
//             onChange={handleChange}
//             type="text"
//             name="username"
//             autoFocus
//             placeholder="Username"
//             value={loginInfo.username}
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             onChange={handleChange}
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={loginInfo.password}
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//       <p>
//         <Link to="/forgot-password">Forgot Password?</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, X } from "lucide-react";
const url ="https://typingbackend-b2mf.onrender.com"
const Login = ({ onSuccess, onCancel, onSwitchToSignup }) => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = loginInfo;

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Replace this with your actual axios call
      const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo)
      });
      
      const data = await response.json();
      const { success, message, jwttoken, userId, profilePicture } = data;

      if (success) {
        console.log("Login successful:", message);

        localStorage.setItem("token", jwttoken);
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userId", userId);
        localStorage.setItem("profilePicture", profilePicture);

        // Call onSuccess if provided (for modal usage)
        if (onSuccess) {
          onSuccess({
            id: userId,
            name: username,
            profilePicture: profilePicture
          });
        } else {
          // For standalone usage without modal
          window.location.href = "/";
        }
      } else {
        setError(message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Replace with your routing logic
    window.location.href = "/forgot-password";
  };

  const handleSignupRoute = () => {
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      // Replace with your routing logic
      window.location.href = "/signup";
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
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm text-center">{error}</p>
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
                placeholder="Enter your username"
                value={loginInfo.username}
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
                placeholder="Enter your password"
                value={loginInfo.password}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
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
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={handleForgotPassword}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
          >
            Forgot Password?
          </button>
          
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-600 flex-1"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="border-t border-gray-600 flex-1"></div>
          </div>

          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={handleSignupRoute}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;