


// import React, { useState } from "react";
// import { Eye, EyeOff, User, Lock, X } from "lucide-react";

// const url ="https://typingbackend-b2mf.onrender.com"

// const Login = ({ onSuccess, onCancel, onSwitchToSignup }) => {
//   const [loginInfo, setLoginInfo] = useState({
//     username: "",
//     password: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo({ ...loginInfo, [name]: value });
//     if (error) setError(""); // Clear error when user starts typing
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { username, password } = loginInfo;

//     if (!username || !password) {
//       setError("All fields are required");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       // Replace this with your actual axios call
//       const response = await fetch(`${url}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(loginInfo)
//       });
      
//       const data = await response.json();
//       const { success, message, jwttoken, userId, profilePicture } = data;

//       if (success) {
//         console.log("Login successful:", message);

//         localStorage.setItem("token", jwttoken);
//         localStorage.setItem("loggedInUser", username);
//         localStorage.setItem("userId", userId);
//         localStorage.setItem("profilePicture", profilePicture);

//         // Call onSuccess if provided (for modal usage)
//         if (onSuccess) {
//           onSuccess({
//             id: userId,
//             name: username,
//             profilePicture: profilePicture
//           });
//         } else {
//           // For standalone usage without modal
//           window.location.href = "/";
//         }
//       } else {
//         setError(message || "Login failed");
//       }
//     } catch (err) {
//       setError("Login failed. Please try again.");
//       console.error("Login error:", err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     // Replace with your routing logic
//     window.location.href = "/forgot-password";
//   };

//   const handleSignupRoute = () => {
//     if (onSwitchToSignup) {
//       onSwitchToSignup();
//     } else {
//       // Replace with your routing logic
//       window.location.href = "/signup";
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 md:p-8 relative">
//         {/* Close button for modal */}
//         {onCancel && (
//           <button
//             onClick={onCancel}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors z-10"
//             aria-label="Close"
//           >
//             <X size={18} className="sm:w-5 sm:h-5" />
//           </button>
//         )}

//         {/* Header */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
//             <User className="text-white" size={20} />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//             Welcome Back
//           </h1>
//           <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Sign in to your account</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 sm:mb-6">
//             <p className="text-red-400 text-sm text-center">{error}</p>
//           </div>
//         )}

//         {/* Form */}
//         <div className="space-y-4 sm:space-y-6">
//           {/* Username Field */}
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
//               Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 onChange={handleChange}
//                 type="text"
//                 name="username"
//                 id="username"
//                 autoFocus
//                 placeholder="Enter your username"
//                 value={loginInfo.username}
//                 className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 onChange={handleChange}
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={loginInfo.password}
//                 className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
//                 disabled={isLoading}
//                 onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
//                 disabled={isLoading}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={handleLogin}
//             disabled={isLoading}
//             className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base active:scale-[0.98] sm:active:scale-[1.01]"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
//                 <span className="text-sm sm:text-base">Signing In...</span>
//               </div>
//             ) : (
//               "Sign In"
//             )}
//           </button>
//         </div>

//         {/* Footer Links */}
//         <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
//           <button
//             onClick={handleForgotPassword}
//             className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors duration-200 block w-full py-1"
//           >
//             Forgot Password?
//           </button>
          
//           <div className="flex items-center justify-center my-3 sm:my-4">
//             <div className="border-t border-gray-600 flex-1"></div>
//             <span className="px-3 sm:px-4 text-gray-400 text-xs sm:text-sm">or</span>
//             <div className="border-t border-gray-600 flex-1"></div>
//           </div>

//           <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
//             Don't have an account?{" "}
//             <button
//               onClick={handleSignupRoute}
//               className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
//             >
//               Sign up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;














import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, X } from "lucide-react";

const url = "https://typingbackend-b2mf.onrender.com";

const Login = ({ onSuccess, onCancel, onSwitchToSignup }) => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
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
      const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const data = await response.json();
      const { success, message, jwttoken, userId, profilePicture } = data;

      if (success) {
        localStorage.setItem("token", jwttoken);
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userId", userId);
        localStorage.setItem("profilePicture", profilePicture);

        if (onSuccess) {
          onSuccess({
            id: userId,
            name: username,
            profilePicture: profilePicture,
          });
        } else {
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
    window.location.href = "/forgot-password";
  };

  const handleSignupRoute = () => {
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      window.location.href = "/signup";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 md:p-8 relative">
        {/* Close button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <User className="text-white" size={20} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 sm:mb-6">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                onChange={handleChange}
                type="text"
                name="username"
                id="username"
                autoFocus
                placeholder="Enter your username"
                value={loginInfo.username}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button (no spinner, just text) */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base active:scale-[0.98] sm:active:scale-[1.01]"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
          <button
            onClick={handleForgotPassword}
            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors duration-200 block w-full py-1"
          >
            Forgot Password?
          </button>

          <div className="flex items-center justify-center my-3 sm:my-4">
            <div className="border-t border-gray-600 flex-1"></div>
            <span className="px-3 sm:px-4 text-gray-400 text-xs sm:text-sm">or</span>
            <div className="border-t border-gray-600 flex-1"></div>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Don't have an account?{" "}
            <button
              onClick={handleSignupRoute}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
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
