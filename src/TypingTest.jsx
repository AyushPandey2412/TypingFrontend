


















// import React, { useState, useEffect, useRef } from "react";
// import { User, LogOut, Timer, Users } from "lucide-react";

// // Import Login and Signup components
// import Login from "./Login"
// import Signup from "./Signup"
// const paragraphs = {
//   words: {
//     "30": [
//       "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
//       "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
//       "Learning to type efficiently is an essential skill in today's digital age where computers dominate most workplaces."
//     ],
//     "60": [
//       "In the heart of the bustling city, where skyscrapers touch the clouds and the streets never sleep, there exists a small café that serves the most aromatic coffee. People from all walks of life gather here, sharing stories and creating memories.",
//       "The art of programming requires patience, logic, and creativity. Every line of code tells a story, and every function serves a purpose in the grand scheme of software development."
//     ]
//   },
//   sentences: {
//     "easy": [
//       "The sun rises in the east and sets in the west every single day.",
//       "Cats are known for their independence and mysterious behavior patterns."
//     ],
//     "medium": [
//       "Artificial intelligence is transforming industries across the globe at an unprecedented pace.",
//       "Climate change poses significant challenges that require immediate global cooperation."
//     ]
//   }
// };

// const TypingTest = () => {
//   // Authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [user, setUser] = useState(null);

//   // Typing test state
//   const [category, setCategory] = useState("words");
//   const [subCategory, setSubCategory] = useState("30");
//   const [originalText, setOriginalText] = useState("");
//   const [userTyped, setUserTyped] = useState("");
//   const [caretPosition, setCaretPosition] = useState(0);
//   const [timer, setTimer] = useState(30);
//   const [selectedTimer, setSelectedTimer] = useState(30);
//   const [isTimerActive, setIsTimerActive] = useState(false);
//   const [testCompleted, setTestCompleted] = useState(false);
//   const [accuracy, setAccuracy] = useState(0);
//   const [speed, setSpeed] = useState(0);
//   const [errors, setErrors] = useState(0);
//   const [countdown, setCountdown] = useState(0);

//   const inputRef = useRef(null);
//   const timerOptions = [15, 30, 45, 60, 120];

//   // Check authentication on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("userData");
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   // ✅ CHANGE 1: Moved calculateResults into useEffect that triggers when testCompleted becomes true
//   useEffect(() => {
//     if (testCompleted) {
//       calculateResults();
//     }
//   }, [testCompleted, userTyped, originalText, selectedTimer]);

//   // Authentication functions
//   const handleLoginSuccess = (userData) => {
//     // Store user data and token in localStorage
//     localStorage.setItem("token", userData.token || "dummy-token");
//     localStorage.setItem("userData", JSON.stringify(userData));
    
//     setIsAuthenticated(true);
//     setUser(userData);
//     setShowLogin(false);
//   };

//   const handleSignupSuccess = (userData) => {
//     // Store user data and token in localStorage
//     localStorage.setItem("token", userData.token || "dummy-token");
//     localStorage.setItem("userData", JSON.stringify(userData));
    
//     setIsAuthenticated(true);
//     setUser(userData);
//     setShowSignup(false);
//   };

//   const handleAuthCancel = () => {
//     setShowLogin(false);
//     setShowSignup(false);
//   };

//   const handleSwitchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };

//   const handleSwitchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userData");
//     setIsAuthenticated(false);
//     setUser(null);
//     refreshTest();
//   };

//   // Updated multiplayer route handler
//   const handleMultiplayer = () => {
//     if (!isAuthenticated) {
//       // Show login modal if user is not authenticated
//       setShowLogin(true);
//       return;
//     }
//     // Route to multiplayer page for authenticated users
//     window.location.href = '/multiplayer';
//     // Or if using React Router: navigate('/multiplayer');
//   };

//   // Typing test functions
//   const loadParagraph = () => {
//     const categoryData = paragraphs[category];
//     if (!categoryData) {
//       setOriginalText("Category not found.");
//       return;
//     }
//     const subCategoryData = categoryData[subCategory];
//     if (!subCategoryData) {
//       setOriginalText("Subcategory not found.");
//       return;
//     }
//     const randomIndex = Math.floor(Math.random() * subCategoryData.length);
//     setOriginalText(subCategoryData[randomIndex]);
//   };

//   useEffect(() => {
//     loadParagraph();
//   }, [category, subCategory]);

//   useEffect(() => {
//     if (inputRef.current && !testCompleted) {
//       inputRef.current.focus();
//     }
//   }, [originalText, testCompleted, countdown]);

//   const handleTyping = (e) => {
//     if (testCompleted || countdown > 0) return;

//     const value = e.target.value;
//     setUserTyped(value);
//     setCaretPosition(value.length);

//     if (!isTimerActive && value.length > 0) {
//       setIsTimerActive(true);
//     }
//   };

//   const renderTypingArea = () => {
//     if (!originalText) return null;

//     return (
//       <div className="relative max-w-7xl mx-auto">
//         <div className="bg-gray-900 rounded-lg p-12 min-h-[400px] relative overflow-hidden">
//           <div className="font-sans text-3xl leading-loose text-center max-w-6xl mx-auto">
//             {originalText.split('').map((char, index) => {
//               // ✅ CHANGE 3: Improved character comparison logic with cleaner structure
//               let className = 'text-gray-500'; // Default for untyped text
              
//               if (index < userTyped.length) {
//                 // Character has been typed
//                 className = userTyped[index] === char 
//                   ? 'text-gray-200' // Correct character
//                   : 'text-red-400 bg-red-400/20'; // Incorrect character
//               } else if (index === userTyped.length) {
//                 // Current cursor position
//                 className = 'text-gray-200 bg-gray-200/20 animate-pulse';
//               }
              
//               return (
//                 <span key={index} className={className}>
//                   {char}
//                 </span>
//               );
//             })}
//           </div>
          
//           <textarea
//             ref={inputRef}
//             value={userTyped}
//             onChange={handleTyping}
//             disabled={timer === 0 || countdown > 0}
//             className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
//             style={{ caretColor: 'transparent' }}
//             autoFocus
//             spellCheck={false}
//           />
//         </div>
        
//         {/* Countdown overlay */}
//         {countdown > 0 && (
//           <div className="absolute inset-0 bg-gray-900/90 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-8xl font-bold text-yellow-500 mb-4 animate-bounce">
//                 {countdown}
//               </div>
//               <div className="text-xl text-gray-300">Get Ready...</div>
//             </div>
//           </div>
//         )}
        
//         {/* Results overlay - shows immediately when timer ends */}
//         {testCompleted && (
//           <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-yellow-500 mb-2">{speed}</div>
//               <div className="text-gray-300">Words Per Minute</div>
//               <div className="text-2xl font-bold text-green-500 mt-2">{accuracy.toFixed(1)}%</div>
//               <div className="text-gray-300">Accuracy</div>
//               <div className="text-lg text-red-400 mt-2">{errors}</div>
//               <div className="text-gray-300">Errors</div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ✅ CHANGE 2: Removed calculateResults() call from timer, only setting testCompleted
//   useEffect(() => {
//     if (isTimerActive) {
//       const interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(interval);
//             setIsTimerActive(false);
//             setTestCompleted(true); // Only this triggers, calculateResults happens in useEffect
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [isTimerActive]);

//   // ✅ CHANGE 4: Results calculation now happens reliably after testCompleted is set
//   const calculateResults = async () => {
//     const totalCharacters = originalText.length;
//     const typedCharacters = userTyped.length;
//     const correctCharacters = userTyped
//       .split("")
//       .filter((char, index) => char === originalText[index]).length;
//     const incorrectCharacters = typedCharacters - correctCharacters;

//     const accuracy = totalCharacters > 0 ? (correctCharacters / Math.min(typedCharacters, totalCharacters)) * 100 : 0;
//     setAccuracy(accuracy);

//     const timeInMinutes = selectedTimer / 60;
//     const wordsTyped = typedCharacters / 5;
//     const wordsPerMinute = wordsTyped / timeInMinutes;
//     setSpeed(Math.round(wordsPerMinute));

//     setErrors(incorrectCharacters);

//     // Save result to backend if authenticated
//     if (isAuthenticated) {
//       try {
//         // Simulate API call
//         console.log("Saving result:", {
//           speed: Math.round(wordsPerMinute),
//           accuracy,
//           errors: incorrectCharacters,
//           category,
//           subCategory,
//           time: selectedTimer
//         });
//       } catch (err) {
//         console.error("Failed to save result", err);
//       }
//     }
//   };

//   const refreshTest = () => {
//     setUserTyped("");
//     setCaretPosition(0);
//     setTimer(selectedTimer || 30);
//     setIsTimerActive(false);
//     setTestCompleted(false);
//     setAccuracy(0);
//     setSpeed(0);
//     setErrors(0);
//     setCountdown(0);
//     loadParagraph();
//   };

//   const startTest = () => {
//     setCountdown(3);
//     const countdownInterval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     const firstSubCategory = Object.keys(paragraphs[e.target.value])[0];
//     setSubCategory(firstSubCategory);
//     refreshTest();
//   };

//   const handleSubCategoryChange = (e) => {
//     setSubCategory(e.target.value);
//     refreshTest();
//   };

//   const handleTimerChange = (value) => {
//     setSelectedTimer(value);
//     setTimer(value);
//     refreshTest();
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       {/* Header */}
//       <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">TT</span>
//             </div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               TypingTest
//             </h1>
//           </div>

//           <div className="flex items-center space-x-4">
//             {/* Multiplayer Button - Visible to all, but requires login */}
//             <button
//               onClick={handleMultiplayer}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
//               title={!isAuthenticated ? "Login required for multiplayer" : "Join multiplayer game"}
//             >
//               <Users size={16} />
//               <span>Multiplayer</span>
//             </button>

//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2 text-gray-300">
//                   <User size={20} />
//                   <span>Welcome, {user?.name}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
//                 >
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setShowLogin(true)}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
//                 >
//                   Login
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-6 py-8">
//         {/* Controls */}
//         <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Category Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Category
//               </label>
//               <select
//                 value={category}
//                 onChange={handleCategoryChange}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {Object.keys(paragraphs).map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Subcategory Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Difficulty
//               </label>
//               <select
//                 value={subCategory}
//                 onChange={handleSubCategoryChange}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {Object.keys(paragraphs[category]).map((subCat) => (
//                   <option key={subCat} value={subCat}>
//                     {isNaN(subCat)
//                       ? subCat.charAt(0).toUpperCase() + subCat.slice(1)
//                       : `${subCat} words`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Timer Options */}
//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-300 mb-3">
//               Test Duration
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {timerOptions.map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => handleTimerChange(value)}
//                   className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
//                     selectedTimer === value
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                   }`}
//                 >
//                   {value}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Centered Timer Display */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 px-8 py-4">
//             <Timer className="mr-3 text-blue-400" size={32} />
//             <div className="text-4xl font-bold text-blue-400">
//               {timer}s
//             </div>
//           </div>
//         </div>

//         {/* Typing Area */}
//         <div className="mb-8">
//           {renderTypingArea()}
//         </div>

//         {/* Action Buttons */}
//         <div className="text-center">
//           {!isTimerActive && !testCompleted && countdown === 0 && (
//             <button
//               onClick={startTest}
//               className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 mr-4"
//             >
//               Start Test
//             </button>
//           )}
//           <button
//             onClick={refreshTest}
//             className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
//           >
//             {testCompleted ? "Take Another Test" : "Reset Test"}
//           </button>
//         </div>
//       </main>

//       {/* Login Modal */}
//       {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md mx-4">
//             <Login 
//               onSuccess={handleLoginSuccess}
//               onCancel={handleAuthCancel}
//               onSwitchToSignup={handleSwitchToSignup}
//             />
//           </div>
//         </div>
//       )}

//       {/* Signup Modal */}
//       {showSignup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md mx-4">
//             <Signup 
//               onSuccess={handleSignupSuccess}
//               onCancel={handleAuthCancel}
//               onSwitchToLogin={handleSwitchToLogin}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingTest;






// perfect resposive




// import React, { useState, useEffect, useRef } from "react";
// import { User, LogOut, Timer, Users, Menu, X, Play, RotateCcw } from "lucide-react";

// const paragraphs = {
//   words: {
//     "30": [
//       "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
//       "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
//       "Learning to type efficiently is an essential skill in today's digital age where computers dominate most workplaces."
//     ],
//     "60": [
//       "In the heart of the bustling city, where skyscrapers touch the clouds and the streets never sleep, there exists a small café that serves the most aromatic coffee. People from all walks of life gather here, sharing stories and creating memories.",
//       "The art of programming requires patience, logic, and creativity. Every line of code tells a story, and every function serves a purpose in the grand scheme of software development."
//     ]
//   },
//   sentences: {
//     "easy": [
//       "The sun rises in the east and sets in the west every single day.",
//       "Cats are known for their independence and mysterious behavior patterns."
//     ],
//     "medium": [
//       "Artificial intelligence is transforming industries across the globe at an unprecedented pace.",
//       "Climate change poses significant challenges that require immediate global cooperation."
//     ]
//   }
// };

// const TypingTest = () => {
//   // Authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [user, setUser] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Typing test state
//   const [category, setCategory] = useState("words");
//   const [subCategory, setSubCategory] = useState("30");
//   const [originalText, setOriginalText] = useState("");
//   const [userTyped, setUserTyped] = useState("");
//   const [caretPosition, setCaretPosition] = useState(0);
//   const [timer, setTimer] = useState(30);
//   const [selectedTimer, setSelectedTimer] = useState(30);
//   const [isTimerActive, setIsTimerActive] = useState(false);
//   const [testCompleted, setTestCompleted] = useState(false);
//   const [accuracy, setAccuracy] = useState(0);
//   const [speed, setSpeed] = useState(0);
//   const [errors, setErrors] = useState(0);
//   const [countdown, setCountdown] = useState(0);

//   const inputRef = useRef(null);
//   const timerOptions = [15, 30, 45, 60, 120];

//   // Check authentication on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("userData");
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   useEffect(() => {
//     if (testCompleted) {
//       calculateResults();
//     }
//   }, [testCompleted, userTyped, originalText, selectedTimer]);

//   // Authentication functions
//   const handleLoginSuccess = (userData) => {
//     localStorage.setItem("token", userData.token || "dummy-token");
//     localStorage.setItem("userData", JSON.stringify(userData));
    
//     setIsAuthenticated(true);
//     setUser(userData);
//     setShowLogin(false);
//     setMobileMenuOpen(false);
//   };

//   const handleSignupSuccess = (userData) => {
//     localStorage.setItem("token", userData.token || "dummy-token");
//     localStorage.setItem("userData", JSON.stringify(userData));
    
//     setIsAuthenticated(true);
//     setUser(userData);
//     setShowSignup(false);
//     setMobileMenuOpen(false);
//   };

//   const handleAuthCancel = () => {
//     setShowLogin(false);
//     setShowSignup(false);
//   };

//   const handleSwitchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };

//   const handleSwitchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userData");
//     setIsAuthenticated(false);
//     setUser(null);
//     setMobileMenuOpen(false);
//     refreshTest();
//   };

//   const handleMultiplayer = () => {
//     if (!isAuthenticated) {
//       setShowLogin(true);
//       return;
//     }
//     window.location.href = '/multiplayer';
//   };

//   // Typing test functions
//   const loadParagraph = () => {
//     const categoryData = paragraphs[category];
//     if (!categoryData) {
//       setOriginalText("Category not found.");
//       return;
//     }
//     const subCategoryData = categoryData[subCategory];
//     if (!subCategoryData) {
//       setOriginalText("Subcategory not found.");
//       return;
//     }
//     const randomIndex = Math.floor(Math.random() * subCategoryData.length);
//     setOriginalText(subCategoryData[randomIndex]);
//   };

//   useEffect(() => {
//     loadParagraph();
//   }, [category, subCategory]);

//   useEffect(() => {
//     if (inputRef.current && !testCompleted) {
//       inputRef.current.focus();
//     }
//   }, [originalText, testCompleted, countdown]);

//   const handleTyping = (e) => {
//     if (testCompleted || countdown > 0) return;

//     const value = e.target.value;
//     setUserTyped(value);
//     setCaretPosition(value.length);

//     if (!isTimerActive && value.length > 0) {
//       setIsTimerActive(true);
//     }
//   };

//   const renderTypingArea = () => {
//     if (!originalText) return null;

//     return (
//       <div className="relative max-w-7xl mx-auto">
//         <div className="bg-gray-900 rounded-lg p-4 sm:p-6 lg:p-12 min-h-[300px] sm:min-h-[400px] relative overflow-hidden">
//           <div className="font-sans text-lg sm:text-xl lg:text-3xl leading-relaxed sm:leading-loose text-center max-w-6xl mx-auto">
//             {originalText.split('').map((char, index) => {
//               let className = 'text-gray-500';
              
//               if (index < userTyped.length) {
//                 className = userTyped[index] === char 
//                   ? 'text-gray-200'
//                   : 'text-red-400 bg-red-400/20';
//               } else if (index === userTyped.length) {
//                 className = 'text-gray-200 bg-gray-200/20 animate-pulse';
//               }
              
//               return (
//                 <span key={index} className={className}>
//                   {char}
//                 </span>
//               );
//             })}
//           </div>
          
//           <textarea
//             ref={inputRef}
//             value={userTyped}
//             onChange={handleTyping}
//             disabled={timer === 0 || countdown > 0}
//             className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
//             style={{ caretColor: 'transparent' }}
//             autoFocus
//             spellCheck={false}
//           />
//         </div>
        
//         {/* Countdown overlay */}
//         {countdown > 0 && (
//           <div className="absolute inset-0 bg-gray-900/90 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-yellow-500 mb-4 animate-bounce">
//                 {countdown}
//               </div>
//               <div className="text-lg sm:text-xl text-gray-300">Get Ready...</div>
//             </div>
//           </div>
//         )}
        
//         {/* Results overlay */}
//         {testCompleted && (
//           <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
//             <div className="text-center px-4">
//               <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-2">{speed}</div>
//               <div className="text-sm sm:text-base text-gray-300">Words Per Minute</div>
//               <div className="text-xl sm:text-2xl font-bold text-green-500 mt-2">{accuracy.toFixed(1)}%</div>
//               <div className="text-sm sm:text-base text-gray-300">Accuracy</div>
//               <div className="text-lg font-medium text-red-400 mt-2">{errors}</div>
//               <div className="text-sm sm:text-base text-gray-300">Errors</div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (isTimerActive) {
//       const interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(interval);
//             setIsTimerActive(false);
//             setTestCompleted(true);
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [isTimerActive]);

//   const calculateResults = async () => {
//     const totalCharacters = originalText.length;
//     const typedCharacters = userTyped.length;
//     const correctCharacters = userTyped
//       .split("")
//       .filter((char, index) => char === originalText[index]).length;
//     const incorrectCharacters = typedCharacters - correctCharacters;

//     const accuracy = totalCharacters > 0 ? (correctCharacters / Math.min(typedCharacters, totalCharacters)) * 100 : 0;
//     setAccuracy(accuracy);

//     const timeInMinutes = selectedTimer / 60;
//     const wordsTyped = typedCharacters / 5;
//     const wordsPerMinute = wordsTyped / timeInMinutes;
//     setSpeed(Math.round(wordsPerMinute));

//     setErrors(incorrectCharacters);

//     if (isAuthenticated) {
//       try {
//         console.log("Saving result:", {
//           speed: Math.round(wordsPerMinute),
//           accuracy,
//           errors: incorrectCharacters,
//           category,
//           subCategory,
//           time: selectedTimer
//         });
//       } catch (err) {
//         console.error("Failed to save result", err);
//       }
//     }
//   };

//   const refreshTest = () => {
//     setUserTyped("");
//     setCaretPosition(0);
//     setTimer(selectedTimer);  // ✅ FIX: Use selectedTimer instead of hardcoded 30
//     setIsTimerActive(false);
//     setTestCompleted(false);
//     setAccuracy(0);
//     setSpeed(0);
//     setErrors(0);
//     setCountdown(0);
//     loadParagraph();
//   };

//   const startTest = () => {
//     setCountdown(3);
//     const countdownInterval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     const firstSubCategory = Object.keys(paragraphs[e.target.value])[0];
//     setSubCategory(firstSubCategory);
//     refreshTest();
//   };

//   const handleSubCategoryChange = (e) => {
//     setSubCategory(e.target.value);
//     refreshTest();
//   };

//   const handleTimerChange = (value) => {
//     setSelectedTimer(value);
//     setTimer(value);  // ✅ FIX: Set timer immediately when option is selected
//     refreshTest();
//   };

//   // Mock Login Component
//   const Login = ({ onSuccess, onCancel, onSwitchToSignup }) => (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//       <div className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
//         />
//         <div className="flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={() => onSuccess({ name: "Demo User", email: "demo@example.com" })}
//             className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
//           >
//             Login
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
//           >
//             Cancel
//           </button>
//         </div>
//         <button
//           onClick={onSwitchToSignup}
//           className="w-full text-blue-400 hover:text-blue-300 text-sm"
//         >
//           Don't have an account? Sign up
//         </button>
//       </div>
//     </div>
//   );

//   // Mock Signup Component
//   const Signup = ({ onSuccess, onCancel, onSwitchToLogin }) => (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
//       <div className="space-y-4">
//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
//         />
//         <div className="flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={() => onSuccess({ name: "New User", email: "new@example.com" })}
//             className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
//           >
//             Sign Up
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
//           >
//             Cancel
//           </button>
//         </div>
//         <button
//           onClick={onSwitchToLogin}
//           className="w-full text-blue-400 hover:text-blue-300 text-sm"
//         >
//           Already have an account? Login
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       {/* Header */}
//       <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">TT</span>
//             </div>
//             <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               TypingTest
//             </h1>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             <button
//               onClick={handleMultiplayer}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
//               title={!isAuthenticated ? "Login required for multiplayer" : "Join multiplayer game"}
//             >
//               <Users size={16} />
//               <span>Multiplayer</span>
//             </button>

//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2 text-gray-300">
//                   <User size={20} />
//                   <span className="hidden lg:inline">Welcome, {user?.name}</span>
//                   <span className="lg:hidden">{user?.name}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
//                 >
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowLogin(true)}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
//               >
//                 Login
//               </button>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-700"
//           >
//             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {mobileMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
//             <div className="space-y-3">
//               <button
//                 onClick={handleMultiplayer}
//                 className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
//               >
//                 <Users size={16} />
//                 <span>Multiplayer</span>
//               </button>

//               {isAuthenticated ? (
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-center space-x-2 text-gray-300">
//                     <User size={20} />
//                     <span>Welcome, {user?.name}</span>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
//                   >
//                     <LogOut size={16} />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setShowLogin(true)}
//                   className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
//                 >
//                   Login
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//         {/* Controls */}
//         <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//             {/* Category Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Category
//               </label>
//               <select
//                 value={category}
//                 onChange={handleCategoryChange}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {Object.keys(paragraphs).map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Subcategory Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Difficulty
//               </label>
//               <select
//                 value={subCategory}
//                 onChange={handleSubCategoryChange}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {Object.keys(paragraphs[category]).map((subCat) => (
//                   <option key={subCat} value={subCat}>
//                     {isNaN(subCat)
//                       ? subCat.charAt(0).toUpperCase() + subCat.slice(1)
//                       : `${subCat} words`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Timer Options */}
//           <div className="mt-4 sm:mt-6">
//             <label className="block text-sm font-medium text-gray-300 mb-3">
//               Test Duration
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {timerOptions.map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => handleTimerChange(value)}
//                   className={`px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
//                     selectedTimer === value
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                   }`}
//                 >
//                   {value}s
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Centered Timer Display */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="inline-flex items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 px-6 sm:px-8 py-3 sm:py-4">
//             <Timer className="mr-2 sm:mr-3 text-blue-400" size={24} />
//             <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400">
//               {timer}s
//             </div>
//           </div>
//         </div>

//         {/* Typing Area */}
//         <div className="mb-6 sm:mb-8">
//           {renderTypingArea()}
//         </div>

//         {/* Action Buttons */}
//         <div className="text-center flex justify-center items-center gap-3">
//           {!isTimerActive && !testCompleted && countdown === 0 && (
//             <button
//               onClick={startTest}
//               className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 transform hover:scale-105 border border-green-500/30"
//               title="Start Test"
//             >
//               <Play size={16} />
//               <span className="text-sm font-medium">Start</span>
//             </button>
//           )}
//           <button
//             onClick={refreshTest}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 transform hover:scale-105 border border-blue-500/30"
//             title={testCompleted ? "Take Another Test" : "Reset Test"}
//           >
//             <RotateCcw size={16} />
//             <span className="text-sm font-medium">
//               {testCompleted ? "New Test" : "Reset"}
//             </span>
//           </button>
//         </div>
//       </main>

//       {/* Login Modal */}
//       {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
//             <Login 
//               onSuccess={handleLoginSuccess}
//               onCancel={handleAuthCancel}
//               onSwitchToSignup={handleSwitchToSignup}
//             />
//           </div>
//         </div>
//       )}

//       {/* Signup Modal */}
//       {showSignup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
//             <Signup 
//               onSuccess={handleSignupSuccess}
//               onCancel={handleAuthCancel}
//               onSwitchToLogin={handleSwitchToLogin}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingTest;


























// ---------------new 

// import React, { useState, useEffect, useRef } from "react";
// import { User, LogOut, Timer, Users, Play, RotateCcw } from "lucide-react";

// // Import Login and Signup components
// import Login from "./Login"
// import Signup from "./Signup"
// const paragraphs = {
//   words: {
//     "30": [
//       "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
//       "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
//       "Learning to type efficiently is an essential skill in today's digital age where computers dominate most workplaces."
//     ],
//     "60": [
//       "In the heart of the bustling city, where skyscrapers touch the clouds and the streets never sleep, there exists a small café that serves the most aromatic coffee. People from all walks of life gather here, sharing stories and creating memories.",
//       "The art of programming requires patience, logic, and creativity. Every line of code tells a story, and every function serves a purpose in the grand scheme of software development."
//     ]
//   },
//   sentences: {
//     "easy": [
//       "The sun rises in the east and sets in the west every single day.",
//       "Cats are known for their independence and mysterious behavior patterns."
//     ],
//     "medium": [
//       "Artificial intelligence is transforming industries across the globe at an unprecedented pace.",
//       "Climate change poses significant challenges that require immediate global cooperation."
//     ]
//   }
// };

// const TypingTest = () => {
//   // Authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [user, setUser] = useState(null);

//   // Typing test state
//   const [category, setCategory] = useState("words");
//   const [subCategory, setSubCategory] = useState("30");
//   const [originalText, setOriginalText] = useState("");
//   const [userTyped, setUserTyped] = useState("");
//   const [caretPosition, setCaretPosition] = useState(0);
//   const [timer, setTimer] = useState(30);
//   const [selectedTimer, setSelectedTimer] = useState(30);
//   const [isTimerActive, setIsTimerActive] = useState(false);
//   const [testCompleted, setTestCompleted] = useState(false);
//   const [accuracy, setAccuracy] = useState(0);
//   const [speed, setSpeed] = useState(0);
//   const [errors, setErrors] = useState(0);
//   const [countdown, setCountdown] = useState(0);

//   const inputRef = useRef(null);
//   const timerOptions = [15, 30, 45, 60, 120];

//   // Check authentication on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("userData");
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   // ✅ CHANGE 1: Moved calculateResults into useEffect that triggers when testCompleted becomes true
//   useEffect(() => {
//     if (testCompleted) {
//       calculateResults();
//     }
//   }, [testCompleted, userTyped, originalText, selectedTimer]);

//   // Authentication functions
//   const handleLoginSuccess = (userData) => {
//     // Store user data and token in localStorage
//     localStorage.setItem("token", userData.token || "dummy-token");
//     localStorage.setItem("userData", JSON.stringify(userData));
    
//     setIsAuthenticated(true);
//     setUser(userData);
//     setShowLogin(false);
//   };

//   const handleSignupSuccess = (userData) => {
//     // Store user data and token in localStorage
//     localStorage.setItem("token", userData.token || "dummy-token");
//     localStorage.setItem("userData", JSON.stringify(userData));
    
//     setIsAuthenticated(true);
//     setUser(userData);
//     setShowSignup(false);
//   };

//   const handleAuthCancel = () => {
//     setShowLogin(false);
//     setShowSignup(false);
//   };

//   const handleSwitchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };

//   const handleSwitchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userData");
//     setIsAuthenticated(false);
//     setUser(null);
//     refreshTest();
//   };

//   // Updated multiplayer route handler
//   const handleMultiplayer = () => {
//     if (!isAuthenticated) {
//       // Show login modal if user is not authenticated
//       setShowLogin(true);
//       return;
//     }
//     // Route to multiplayer page for authenticated users
//     window.location.href = '/multiplayer';
//     // Or if using React Router: navigate('/multiplayer');
//   };

//   // Typing test functions
//   const loadParagraph = () => {
//     const categoryData = paragraphs[category];
//     if (!categoryData) {
//       setOriginalText("Category not found.");
//       return;
//     }
//     const subCategoryData = categoryData[subCategory];
//     if (!subCategoryData) {
//       setOriginalText("Subcategory not found.");
//       return;
//     }
//     const randomIndex = Math.floor(Math.random() * subCategoryData.length);
//     setOriginalText(subCategoryData[randomIndex]);
//   };

//   useEffect(() => {
//     loadParagraph();
//   }, [category, subCategory]);

//   useEffect(() => {
//     if (inputRef.current && !testCompleted) {
//       inputRef.current.focus();
//     }
//   }, [originalText, testCompleted, countdown]);

//   const handleTyping = (e) => {
//     if (testCompleted || countdown > 0) return;

//     const value = e.target.value;
//     setUserTyped(value);
//     setCaretPosition(value.length);

//     if (!isTimerActive && value.length > 0) {
//       setIsTimerActive(true);
//     }
//   };

//   const renderTypingArea = () => {
//     if (!originalText) return null;

//     return (
//       <div className="relative w-full mx-auto">
//         <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] relative overflow-hidden">
//           <div className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-relaxed md:leading-loose text-center max-w-full mx-auto">
//             {originalText.split('').map((char, index) => {
//               // ✅ CHANGE 3: Improved character comparison logic with cleaner structure
//               let className = 'text-gray-500'; // Default for untyped text
              
//               if (index < userTyped.length) {
//                 // Character has been typed
//                 className = userTyped[index] === char 
//                   ? 'text-gray-200' // Correct character
//                   : 'text-red-400 bg-red-400/20'; // Incorrect character
//               } else if (index === userTyped.length) {
//                 // Current cursor position
//                 className = 'text-gray-200 bg-gray-200/20 animate-pulse';
//               }
              
//               return (
//                 <span key={index} className={className}>
//                   {char}
//                 </span>
//               );
//             })}
//           </div>
          
//           <textarea
//             ref={inputRef}
//             value={userTyped}
//             onChange={handleTyping}
//             disabled={timer === 0 || countdown > 0}
//             className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
//             style={{ caretColor: 'transparent' }}
//             autoFocus
//             spellCheck={false}
//           />
//         </div>
        
//         {/* Countdown overlay */}
//         {countdown > 0 && (
//           <div className="absolute inset-0 bg-gray-900/90 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-4xl sm:text-6xl md:text-8xl font-bold text-yellow-500 mb-4 animate-bounce">
//                 {countdown}
//               </div>
//               <div className="text-lg sm:text-xl text-gray-300">Get Ready...</div>
//             </div>
//           </div>
//         )}
        
//         {/* Results overlay - shows immediately when timer ends */}
//         {testCompleted && (
//           <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
//             <div className="text-center px-4">
//               <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500 mb-2">{speed}</div>
//               <div className="text-sm sm:text-base text-gray-300">Words Per Minute</div>
//               <div className="text-xl sm:text-2xl font-bold text-green-500 mt-2">{accuracy.toFixed(1)}%</div>
//               <div className="text-sm sm:text-base text-gray-300">Accuracy</div>
//               <div className="text-lg font-semibold text-red-400 mt-2">{errors}</div>
//               <div className="text-sm sm:text-base text-gray-300">Errors</div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ✅ CHANGE 2: Removed calculateResults() call from timer, only setting testCompleted
//   useEffect(() => {
//     if (isTimerActive) {
//       const interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(interval);
//             setIsTimerActive(false);
//             setTestCompleted(true); // Only this triggers, calculateResults happens in useEffect
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [isTimerActive]);

//   // ✅ CHANGE 4: Results calculation now happens reliably after testCompleted is set
//   const calculateResults = async () => {
//     const totalCharacters = originalText.length;
//     const typedCharacters = userTyped.length;
//     const correctCharacters = userTyped
//       .split("")
//       .filter((char, index) => char === originalText[index]).length;
//     const incorrectCharacters = typedCharacters - correctCharacters;

//     const accuracy = totalCharacters > 0 ? (correctCharacters / Math.min(typedCharacters, totalCharacters)) * 100 : 0;
//     setAccuracy(accuracy);

//     const timeInMinutes = selectedTimer / 60;
//     const wordsTyped = typedCharacters / 5;
//     const wordsPerMinute = wordsTyped / timeInMinutes;
//     setSpeed(Math.round(wordsPerMinute));

//     setErrors(incorrectCharacters);

//     // Save result to backend if authenticated
//     if (isAuthenticated) {
//       try {
//         // Simulate API call
//         console.log("Saving result:", {
//           speed: Math.round(wordsPerMinute),
//           accuracy,
//           errors: incorrectCharacters,
//           category,
//           subCategory,
//           time: selectedTimer
//         });
//       } catch (err) {
//         console.error("Failed to save result", err);
//       }
//     }
//   };

//   const refreshTest = () => {
//     setUserTyped("");
//     setCaretPosition(0);
//     setTimer(selectedTimer || 30);
//     setIsTimerActive(false);
//     setTestCompleted(false);
//     setAccuracy(0);
//     setSpeed(0);
//     setErrors(0);
//     setCountdown(0);
//     loadParagraph();
//   };

//   const startTest = () => {
//     setCountdown(3);
//     const countdownInterval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     const firstSubCategory = Object.keys(paragraphs[e.target.value])[0];
//     setSubCategory(firstSubCategory);
//     refreshTest();
//   };

//   const handleSubCategoryChange = (e) => {
//     setSubCategory(e.target.value);
//     refreshTest();
//   };

//   const handleTimerChange = (value) => {
//     setSelectedTimer(value);
//     setTimer(value);
//     refreshTest();
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       {/* Header */}
//       <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-2 sm:space-x-3">
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xs sm:text-sm">TT</span>
//             </div>
//             <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               TypingTest
//             </h1>
//           </div>

//           <div className="flex items-center space-x-2 sm:space-x-4">
//             {/* Multiplayer Button - Visible to all, but requires login */}
//             <button
//               onClick={handleMultiplayer}
//               className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
//               title={!isAuthenticated ? "Login required for multiplayer" : "Join multiplayer game"}
//             >
//               <Users size={14} className="sm:w-4 sm:h-4" />
//               <span className="hidden sm:inline">Multiplayer</span>
//               <span className="sm:hidden">Multi</span>
//             </button>

//             {isAuthenticated ? (
//               <div className="flex items-center space-x-2 sm:space-x-4">
//                 <div className="hidden md:flex items-center space-x-2 text-gray-300">
//                   <User size={20} />
//                   <span>Welcome, {user?.name}</span>
//                 </div>
//                 <div className="md:hidden flex items-center text-gray-300">
//                   <User size={16} />
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
//                 >
//                   <LogOut size={14} className="sm:w-4 sm:h-4" />
//                   <span className="hidden sm:inline">Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <button
//                   onClick={() => setShowLogin(true)}
//                   className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
//                 >
//                   Login
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
//         {/* Controls */}
//         <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//             {/* Category Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Category
//               </label>
//               <select
//                 value={category}
//                 onChange={handleCategoryChange}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//               >
//                 {Object.keys(paragraphs).map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Subcategory Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Difficulty
//               </label>
//               <select
//                 value={subCategory}
//                 onChange={handleSubCategoryChange}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//               >
//                 {Object.keys(paragraphs[category]).map((subCat) => (
//                   <option key={subCat} value={subCat}>
//                     {isNaN(subCat)
//                       ? subCat.charAt(0).toUpperCase() + subCat.slice(1)
//                       : `${subCat} words`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Timer Options */}
//           <div className="mt-4 sm:mt-6">
//             <label className="block text-sm font-medium text-gray-300 mb-3">
//               Test Duration
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {timerOptions.map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => handleTimerChange(value)}
//                   className={`px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
//                     selectedTimer === value
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                   }`}
//                 >
//                   {value}s
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Centered Timer Display */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="inline-flex items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 px-6 sm:px-8 py-3 sm:py-4">
//             <Timer className="mr-2 sm:mr-3 text-blue-400" size={24} />
//             <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
//               {timer}s
//             </div>
//           </div>
//         </div>

//         {/* Typing Area */}
//         <div className="mb-6 sm:mb-8">
//           {renderTypingArea()}
//         </div>

//         {/* Action Buttons */}
//         <div className="text-center">
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
//             {!isTimerActive && !testCompleted && countdown === 0 && (
//               <button
//                 onClick={startTest}
//                 className="flex items-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
//               >
//                 <Play size={18} />
//                 <span>Start Test</span>
//               </button>
//             )}
//             <button
//               onClick={refreshTest}
//               className="flex items-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
//             >
//               <RotateCcw size={18} />
//               <span>{testCompleted ? "Take Another Test" : "Reset Test"}</span>
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Login Modal */}
//       {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
//             <Login 
//               onSuccess={handleLoginSuccess}
//               onCancel={handleAuthCancel}
//               onSwitchToSignup={handleSwitchToSignup}
//             />
//           </div>
//         </div>
//       )}

//       {/* Signup Modal */}
//       {showSignup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
//             <Signup 
//               onSuccess={handleSignupSuccess}
//               onCancel={handleAuthCancel}
//               onSwitchToLogin={handleSwitchToLogin}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingTest;



// ---hum

import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, Timer, Users, Play, RotateCcw, Menu, X } from "lucide-react";

// Import Login and Signup components
import Login from "./Login"
import Signup from "./Signup"

const paragraphs = {
  words: {
    "30": [
      "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
      "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
      "Learning to type efficiently is an essential skill in today's digital age where computers dominate most workplaces."
    ],
    "60": [
      "In the heart of the bustling city, where skyscrapers touch the clouds and the streets never sleep, there exists a small café that serves the most aromatic coffee. People from all walks of life gather here, sharing stories and creating memories.",
      "The art of programming requires patience, logic, and creativity. Every line of code tells a story, and every function serves a purpose in the grand scheme of software development."
    ]
  },
  sentences: {
    "easy": [
      "The sun rises in the east and sets in the west every single day.",
      "Cats are known for their independence and mysterious behavior patterns."
    ],
    "medium": [
      "Artificial intelligence is transforming industries across the globe at an unprecedented pace.",
      "Climate change poses significant challenges that require immediate global cooperation."
    ]
  }
};

const TypingTest = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Typing test state
  const [category, setCategory] = useState("words");
  const [subCategory, setSubCategory] = useState("30");
  const [originalText, setOriginalText] = useState("");
  const [userTyped, setUserTyped] = useState("");
  const [caretPosition, setCaretPosition] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedTimer, setSelectedTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const inputRef = useRef(null);
  const timerOptions = [15, 30, 45, 60, 120];

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (testCompleted) {
      calculateResults();
    }
  }, [testCompleted, userTyped, originalText, selectedTimer]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Authentication functions
  const handleLoginSuccess = (userData) => {
    localStorage.setItem("token", userData.token || "dummy-token");
    localStorage.setItem("userData", JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUser(userData);
    setShowLogin(false);
    setShowMobileMenu(false);
  };

  const handleSignupSuccess = (userData) => {
    localStorage.setItem("token", userData.token || "dummy-token");
    localStorage.setItem("userData", JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUser(userData);
    setShowSignup(false);
    setShowMobileMenu(false);
  };

  const handleAuthCancel = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
    setShowMobileMenu(false);
    refreshTest();
  };

  const handleMultiplayer = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      setShowMobileMenu(false);
      return;
    }
    window.location.href = '/multiplayer';
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowMobileMenu(false);
  };

  // Typing test functions
  const loadParagraph = () => {
    const categoryData = paragraphs[category];
    if (!categoryData) {
      setOriginalText("Category not found.");
      return;
    }
    const subCategoryData = categoryData[subCategory];
    if (!subCategoryData) {
      setOriginalText("Subcategory not found.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * subCategoryData.length);
    setOriginalText(subCategoryData[randomIndex]);
  };

  useEffect(() => {
    loadParagraph();
  }, [category, subCategory]);

  useEffect(() => {
    if (inputRef.current && !testCompleted) {
      inputRef.current.focus();
    }
  }, [originalText, testCompleted, countdown]);

  const handleTyping = (e) => {
    if (testCompleted || countdown > 0) return;

    const value = e.target.value;
    setUserTyped(value);
    setCaretPosition(value.length);

    if (!isTimerActive && value.length > 0) {
      setIsTimerActive(true);
    }
  };

  const renderTypingArea = () => {
    if (!originalText) return null;

    return (
      <div className="relative w-full mx-auto">
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] relative overflow-hidden">
          <div className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-relaxed md:leading-loose text-center max-w-full mx-auto">
            {originalText.split('').map((char, index) => {
              let className = 'text-gray-500';
              
              if (index < userTyped.length) {
                className = userTyped[index] === char 
                  ? 'text-gray-200'
                  : 'text-red-400 bg-red-400/20';
              } else if (index === userTyped.length) {
                className = 'text-gray-200 bg-gray-200/20 animate-pulse';
              }
              
              return (
                <span key={index} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
          
          <textarea
            ref={inputRef}
            value={userTyped}
            onChange={handleTyping}
            disabled={timer === 0 || countdown > 0}
            className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
            style={{ caretColor: 'transparent' }}
            autoFocus
            spellCheck={false}
          />
        </div>
        
        {countdown > 0 && (
          <div className="absolute inset-0 bg-gray-900/90 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-8xl font-bold text-yellow-500 mb-4 animate-bounce">
                {countdown}
              </div>
              <div className="text-lg sm:text-xl text-gray-300">Get Ready...</div>
            </div>
          </div>
        )}
        
        {testCompleted && (
          <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500 mb-2">{speed}</div>
              <div className="text-sm sm:text-base text-gray-300">Words Per Minute</div>
              <div className="text-xl sm:text-2xl font-bold text-green-500 mt-2">{accuracy.toFixed(1)}%</div>
              <div className="text-sm sm:text-base text-gray-300">Accuracy</div>
              <div className="text-lg font-semibold text-red-400 mt-2">{errors}</div>
              <div className="text-sm sm:text-base text-gray-300">Errors</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isTimerActive) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            setTestCompleted(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerActive]);

  const calculateResults = async () => {
    const totalCharacters = originalText.length;
    const typedCharacters = userTyped.length;
    const correctCharacters = userTyped
      .split("")
      .filter((char, index) => char === originalText[index]).length;
    const incorrectCharacters = typedCharacters - correctCharacters;

    const accuracy = totalCharacters > 0 ? (correctCharacters / Math.min(typedCharacters, totalCharacters)) * 100 : 0;
    setAccuracy(accuracy);

    const timeInMinutes = selectedTimer / 60;
    const wordsTyped = typedCharacters / 5;
    const wordsPerMinute = wordsTyped / timeInMinutes;
    setSpeed(Math.round(wordsPerMinute));

    setErrors(incorrectCharacters);

    if (isAuthenticated) {
      try {
        console.log("Saving result:", {
          speed: Math.round(wordsPerMinute),
          accuracy,
          errors: incorrectCharacters,
          category,
          subCategory,
          time: selectedTimer
        });
      } catch (err) {
        console.error("Failed to save result", err);
      }
    }
  };

  const refreshTest = () => {
    setUserTyped("");
    setCaretPosition(0);
    setTimer(selectedTimer || 30);
    setIsTimerActive(false);
    setTestCompleted(false);
    setAccuracy(0);
    setSpeed(0);
    setErrors(0);
    setCountdown(0);
    loadParagraph();
  };

  const startTest = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    const firstSubCategory = Object.keys(paragraphs[e.target.value])[0];
    setSubCategory(firstSubCategory);
    refreshTest();
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    refreshTest();
  };

  const handleTimerChange = (value) => {
    setSelectedTimer(value);
    setTimer(value);
    refreshTest();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">TT</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TypingTest
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleMultiplayer}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              title={!isAuthenticated ? "Login required for multiplayer" : "Join multiplayer game"}
            >
              <Users size={16} />
              <span>Multiplayer</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User size={20} />
                  <span>Welcome, {user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleShowLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden mobile-menu-container relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {showMobileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <User size={18} />
                        <span className="font-medium">{user?.name}</span>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleMultiplayer}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Users size={18} className="text-green-400" />
                        <span>Multiplayer</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 text-red-400"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-2">
                    <button
                      onClick={handleMultiplayer}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200"
                    >
                      <Users size={18} className="text-green-400" />
                      <span>Multiplayer</span>
                      <span className="text-xs text-gray-500 ml-auto">(Login required)</span>
                    </button>
                    
                    <button
                      onClick={handleShowLogin}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 text-blue-400"
                    >
                      <User size={18} />
                      <span>Login</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        {/* Controls */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                {Object.keys(paragraphs).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={subCategory}
                onChange={handleSubCategoryChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                {Object.keys(paragraphs[category]).map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {isNaN(subCat)
                      ? subCat.charAt(0).toUpperCase() + subCat.slice(1)
                      : `${subCat} words`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timer Options */}
          <div className="mt-4 sm:mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Test Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {timerOptions.map((value) => (
                <button
                  key={value}
                  onClick={() => handleTimerChange(value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                    selectedTimer === value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {value}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Centered Timer Display */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 px-6 sm:px-8 py-3 sm:py-4">
            <Timer className="mr-2 sm:mr-3 text-blue-400" size={24} />
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
              {timer}s
            </div>
          </div>
        </div>

        {/* Typing Area */}
        <div className="mb-6 sm:mb-8">
          {renderTypingArea()}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {!isTimerActive && !testCompleted && countdown === 0 && (
              <button
                onClick={startTest}
                className="flex items-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
              >
                <Play size={18} />
                <span>Start Test</span>
              </button>
            )}
            <button
              onClick={refreshTest}
              className="flex items-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
            >
              <RotateCcw size={18} />
              <span>{testCompleted ? "Take Another Test" : "Reset Test"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <Login 
              onSuccess={handleLoginSuccess}
              onCancel={handleAuthCancel}
              onSwitchToSignup={handleSwitchToSignup}
            />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <Signup 
              onSuccess={handleSignupSuccess}
              onCancel={handleAuthCancel}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingTest;