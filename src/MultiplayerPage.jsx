

// // // perect
// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// const SERVER_URL = "http://localhost:4000";

// // Sample paragraphs data
// const paragraphsData = {
//   words: {
//     "25": [
//       "The quick brown fox jumps over the lazy dog near the old wooden fence in the countryside during a beautiful sunny morning while birds chirp melodiously.",
//       "Technology has revolutionized our daily lives in ways we never imagined possible, making communication faster and more efficient than ever before in human history."
//     ],
//     "50": [
//       "The quick brown fox jumps over the lazy dog near the old wooden fence in the countryside during a beautiful sunny morning while birds chirp melodiously. Technology has revolutionized our daily lives in ways we never imagined possible, making communication faster and more efficient than ever before in human history and society."
//     ]
//   },
//   punctuation: {
//     short: ["Hello, world! How are you today? I'm doing great, thanks for asking."],
//     medium: ["Hello, world! How are you today? I'm doing great, thanks for asking. What about you? Are you having a good day?"]
//   }
// };

// function ModernTypingApp() {
//   const [category, setCategory] = useState("words");
//   const [subcategory, setSubcategory] = useState("");
//   const [selectedWordCount, setSelectedWordCount] = useState("25");
//   const [timerDuration, setTimerDuration] = useState(60);

//   const [paragraph, setParagraph] = useState("");
//   const [roomCode, setRoomCode] = useState("");
//   const [joinedRoom, setJoinedRoom] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [testStarted, setTestStarted] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [typedText, setTypedText] = useState("");
//   const [timeLeft, setTimeLeft] = useState(timerDuration);
//   const [actualTimeLeft, setActualTimeLeft] = useState(timerDuration + 15); // Hidden timer with 15s buffer
//   const [wpm, setWpm] = useState(0);
//   const [accuracy, setAccuracy] = useState(100);
//   const [showingResults, setShowingResults] = useState(false);
//   const [finalResults, setFinalResults] = useState(null);
  
//   // Real-time results storage
//   const [realtimeResults, setRealtimeResults] = useState({});
  
//   // Store test settings
//   const [testSettings, setTestSettings] = useState({
//     category: "words",
//     subcategory: "",
//     wordCount: "25",
//     duration: 60
//   });

//   const socketRef = useRef(null);
//   const intervalRef = useRef(null);
//   const usernameRef = useRef("");
//   const testStartTimeRef = useRef(null);
//   const inputRef = useRef(null);
//   const roomCodeRef = useRef("");
//   const testDurationRef = useRef(60);

//   useEffect(() => {
//     setTimeLeft(timerDuration);
//     setActualTimeLeft(timerDuration + 15);
//     testDurationRef.current = timerDuration;
//   }, [timerDuration]);

//   // Improved real-time calculation with better timing
//   const calculateRealtimeStats = (currentTypedText, currentParagraph, startTime) => {
//     if (!currentParagraph || !startTime) {
//       return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
//     }

//     const now = Date.now();
//     const elapsedTimeMs = now - startTime;
//     const elapsedTimeMinutes = elapsedTimeMs / (1000 * 60); // Convert to minutes

//     const typedChars = currentTypedText.length;
//     let correctChars = 0;

//     // Simple character comparison
//     const compareLength = Math.min(typedChars, currentParagraph.length);
//     for (let i = 0; i < compareLength; i++) {
//       if (currentTypedText[i] === currentParagraph[i]) {
//         correctChars++;
//       }
//     }

//     const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
    
//     // WPM calculation: (correct characters / 5) / elapsed time in minutes
//     const wpm = elapsedTimeMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeMinutes) : 0;

//     return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
//   };

//   // Calculate final stats at the end of test
//   const calculateFinalStats = (currentTypedText, currentParagraph, duration) => {
//     if (!currentParagraph) {
//       return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
//     }

//     const typedChars = currentTypedText.length;
//     let correctChars = 0;

//     const compareLength = Math.min(typedChars, currentParagraph.length);
//     for (let i = 0; i < compareLength; i++) {
//       if (currentTypedText[i] === currentParagraph[i]) {
//         correctChars++;
//       }
//     }

//     const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
    
//     // Final WPM: (correct characters / 5) / (duration in minutes)
//     const durationMinutes = duration / 60;
//     const wpm = durationMinutes > 0 ? Math.round((correctChars / 5) / durationMinutes) : 0;

//     return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
//   };

//   useEffect(() => {
//     socketRef.current = io(SERVER_URL);

//     socketRef.current.on("room-update", (usernames) => {
//       setUsers(usernames.map((name, index) => ({ id: index, username: name })));
//     });

//     socketRef.current.on("start-test", ({ paragraph: receivedParagraph, startTime, duration, settings }) => {
//       setParagraph(receivedParagraph);
//       setTestStarted(true);
//       setTimeLeft(duration);
//       setActualTimeLeft(duration + 15);
//       setTypedText("");
//       setShowingResults(false);
//       setFinalResults(null);
//       setWpm(0);
//       setAccuracy(100);
//       setRealtimeResults({});
//       testDurationRef.current = duration;
      
//       if (settings) {
//         setTestSettings(settings);
//       }
      
//       // Start 3-second countdown
//       setCountdown(3);
//       let countdownInterval = setInterval(() => {
//         setCountdown(prev => {
//           if (prev <= 1) {
//             clearInterval(countdownInterval);
            
//             const now = Date.now();
//             const delay = Math.max(startTime - now, 0);

//             setTimeout(() => {
//               setCountdown(0);
//               testStartTimeRef.current = Date.now(); // Set actual start time
              
//               // Start dual timer system
//               intervalRef.current = setInterval(() => {
//                 const currentTime = Date.now();
//                 const elapsed = Math.floor((currentTime - testStartTimeRef.current) / 1000);
//                 const userTimeRemaining = Math.max(duration - elapsed, 0);
//                 const actualTimeRemaining = Math.max((duration + 15) - elapsed, 0);
                
//                 setTimeLeft(userTimeRemaining);
//                 setActualTimeLeft(actualTimeRemaining);

//                 // When user timer ends, show results and calculate final stats
//                 if (userTimeRemaining <= 0 && !showingResults) {
//                   setShowingResults(true);
                  
//                   // Calculate final stats using the full duration
//                   const currentTypedTextRef = inputRef.current?.value || "";
//                   const finalStats = calculateFinalStats(currentTypedTextRef, receivedParagraph, duration);
                  
//                   console.log("Final stats calculated:", finalStats); // Debug log
                  
//                   setWpm(finalStats.wpm);
//                   setAccuracy(finalStats.accuracy);
                  
//                   // Store and emit final result
//                   const finalResult = {
//                     username: usernameRef.current,
//                     wpm: finalStats.wpm,
//                     accuracy: finalStats.accuracy,
//                     correctChars: finalStats.correctChars,
//                     totalChars: finalStats.totalChars,
//                     completed: true
//                   };
                  
//                   console.log("Emitting final result:", finalResult); // Debug log
                  
//                   // Emit result immediately
//                   socketRef.current.emit("submit-result", {
//                     roomCode: roomCodeRef.current,
//                     username: usernameRef.current,
//                     result: finalResult
//                   });
//                 }

//                 // When actual timer ends, stop everything
//                 if (actualTimeRemaining <= 0) {
//                   clearInterval(intervalRef.current);
//                 }
//               }, 1000);
//             }, delay);
            
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     });

//     // Listen for real-time results from other users
//     socketRef.current.on("realtime-update", (data) => {
//       setRealtimeResults(prev => ({
//         ...prev,
//         [data.username]: data.stats
//       }));
//     });

//     socketRef.current.on("results", (results) => {
//       console.log("Received final results:", results);
//       setFinalResults(results);
//     });

//     return () => {
//       socketRef.current.disconnect();
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   const getRandomParagraph = () => {
//     if (category === "words") {
//       const options = paragraphsData.words[selectedWordCount] || [];
//       if (options.length === 0) return "No paragraph found for this word count.";
//       const randomIndex = Math.floor(Math.random() * options.length);
//       return options[randomIndex];
//     } else {
//       if (!subcategory) return "Please select a subcategory.";
//       const options = paragraphsData[category]?.[subcategory] || [];
//       if (options.length === 0) return "No paragraph found for this subcategory.";
//       const randomIndex = Math.floor(Math.random() * options.length);
//       return options[randomIndex];
//     }
//   };

//   const handleCreateRoom = () => {
//     const username = "Host_" + Math.floor(Math.random() * 1000);
//     usernameRef.current = username;
//     setIsHost(true);

//     const randomPara = getRandomParagraph();
//     setParagraph(randomPara);

//     const currentSettings = {
//       category,
//       subcategory,
//       wordCount: selectedWordCount,
//       duration: timerDuration
//     };
//     setTestSettings(currentSettings);

//     socketRef.current.emit("create-room", { username }, ({ roomCode }) => {
//       setRoomCode(roomCode);
//       roomCodeRef.current = roomCode;
//       setJoinedRoom(true);
//     });
//   };

//   const handleJoinRoom = () => {
//     if (!roomCode.trim()) {
//       alert("Please enter a room code.");
//       return;
//     }

//     const username = "Guest_" + Math.floor(Math.random() * 1000);
//     usernameRef.current = username;
//     setIsHost(false);

//     socketRef.current.emit("join-room", { username, roomCode }, ({ success, error }) => {
//       if (!success) {
//         alert(error || "Failed to join room.");
//         return;
//       }
//       setRoomCode(roomCode);
//       roomCodeRef.current = roomCode;
//       setJoinedRoom(true);
//     });
//   };

//   const handleStartTest = () => {
//     if (!isHost) return;
    
//     const currentSettings = {
//       category,
//       subcategory,
//       wordCount: selectedWordCount,
//       duration: timerDuration
//     };
    
//     socketRef.current.emit("start-test", { 
//       roomCode: roomCodeRef.current, 
//       paragraph, 
//       duration: timerDuration,
//       settings: currentSettings 
//     });
//   };

//   const handleTyping = (e) => {
//     if (timeLeft === 0 || countdown > 0) return;
    
//     const newTypedText = e.target.value;
//     setTypedText(newTypedText);
    
//     // Calculate and store real-time stats using actual start time
//     if (testStartTimeRef.current) {
//       const stats = calculateRealtimeStats(newTypedText, paragraph, testStartTimeRef.current);
//       setWpm(stats.wpm);
//       setAccuracy(stats.accuracy);
      
//       // Emit real-time stats every few keystrokes (throttled)
//       if (newTypedText.length % 3 === 0 || newTypedText.length === 1) {
//         socketRef.current.emit("realtime-stats", {
//           roomCode: roomCodeRef.current,
//           username: usernameRef.current,
//           stats: {
//             wpm: stats.wpm,
//             accuracy: stats.accuracy,
//             progress: Math.min((newTypedText.length / paragraph.length) * 100, 100)
//           }
//         });
//       }
//     }
//   };

//   const subcategoryOptions = {
//     punctuation: ["short", "medium", "long"],
//     numbers: ["short", "medium", "long"],
//     quotes: ["short", "medium", "long"],
//   };



// const renderTypingArea = () => {
//     if (!paragraph) return null;

//     return (
//               <div className="relative max-w-7xl mx-auto">
//         <div className="bg-gray-900 rounded-lg p-12 min-h-[400px] relative overflow-hidden">
//           <div className="font-sans text-3xl leading-loose text-center max-w-6xl mx-auto">
//             {paragraph.split('').map((char, index) => {
//               let className = 'text-gray-500'; // Medium gray for untyped text
              
//               if (index < typedText.length) {
//                 if (typedText[index] === char) {
//                   className = 'text-gray-200'; // Light gray for correct characters
//                 } else {
//                   className = 'text-red-400 bg-red-400/20'; // Red for errors
//                 }
//               } else if (index === typedText.length) {
//                 className = 'text-gray-200 bg-gray-200/20 animate-pulse'; // Current cursor position
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
//             value={typedText}
//             onChange={handleTyping}
//             disabled={timeLeft === 0 || countdown > 0}
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
//         {showingResults && timeLeft === 0 && countdown === 0 && (
//           <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-yellow-500 mb-2">{wpm}</div>
//               <div className="text-gray-300">Words Per Minute</div>
//               <div className="text-2xl font-bold text-green-500 mt-2">{accuracy}%</div>
//               <div className="text-gray-300">Accuracy</div>
//               <div className="text-sm text-gray-400 mt-4">
//                 Final results calculating...
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
//   if (!joinedRoom) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-8">
//         <div className="max-w-6xl w-full">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
//               TypingTest
//             </h1>
//             <p className="text-gray-400 text-lg">Modern multiplayer typing test</p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
//             <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
//               <h2 className="text-2xl font-bold text-blue-500 mb-6">Create Room</h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
//                   <select
//                     value={category}
//                     onChange={(e) => {
//                       setCategory(e.target.value);
//                       setSubcategory("");
//                       setSelectedWordCount("25");
//                     }}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                   >
//                     {Object.keys(paragraphsData).map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {category === "words" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
//                     <select
//                       value={selectedWordCount}
//                       onChange={(e) => setSelectedWordCount(e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     >
//                       {Object.keys(paragraphsData.words).map((count) => (
//                         <option key={count} value={count}>
//                           {count} words
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {category !== "words" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
//                     <select
//                       value={subcategory}
//                       onChange={(e) => setSubcategory(e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     >
//                       <option value="">-- Select --</option>
//                       {subcategoryOptions[category]?.map((subcat) => (
//                         <option key={subcat} value={subcat}>
//                           {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Timer Duration</label>
//                   <select
//                     value={timerDuration}
//                     onChange={(e) => setTimerDuration(Number(e.target.value))}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                   >
//                     {[15, 30, 45, 60, 120].map((time) => (
//                       <option key={time} value={time}>
//                         {time} seconds
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button 
//                   onClick={handleCreateRoom}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   Create Room
//                 </button>
//               </div>
//             </div>

//             <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
//               <h2 className="text-2xl font-bold text-green-500 mb-6">Join Room</h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Room Code</label>
//                   <input
//                     type="text"
//                     value={roomCode}
//                     onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
//                     placeholder="Enter 6-digit code"
//                     maxLength={6}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest font-mono transition-colors duration-200"
//                   />
//                 </div>

//                 <button 
//                   onClick={handleJoinRoom}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   Join Room
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="bg-gray-800 border-b border-gray-700 p-4">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//             TypingTest
//           </h1>
//           <div className="flex items-center gap-4 text-sm">
//             <span className="text-gray-400">Room:</span>
//             <span className="bg-gray-700 px-3 py-1 rounded-lg font-mono text-blue-400 border border-gray-700">{roomCode}</span>
//             <span className="text-gray-300">{isHost ? 'Host' : 'Guest'}</span>
//             {isHost && <span className="text-yellow-500">👑</span>}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-8">
//         {!testStarted ? (
//           <div className="text-center">
//             <div className="mb-8">
//               <div className="inline-flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                   <span className="text-gray-300">Timer: {timerDuration}s</span>
//                 </div>
//                 <div className="w-px h-4 bg-gray-600"></div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span className="text-gray-300">Category: {category}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h3 className="text-lg font-medium text-gray-300 mb-4">Players in Room</h3>
//               <div className="flex flex-wrap justify-center gap-3">
//                 {users.map((user) => (
//                   <div key={user.id} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
//                     <span className="text-gray-100">{user.username}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {isHost && (
//               <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//                 <h4 className="text-lg font-medium text-gray-100 mb-4">Preview Text</h4>
//                 <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-left">
//                   <p className="text-gray-400 leading-relaxed">{paragraph || "No paragraph loaded"}</p>
//                 </div>
//                 <button 
//                   onClick={handleStartTest}
//                   disabled={users.length < 2}
//                   className={`mt-6 font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
//                     users.length < 2 
//                       ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-700' 
//                       : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
//                   }`}
//                 >
//                   {users.length < 2 ? 'Waiting for 2 players...' : 'Start Test'}
//                 </button>
//               </div>
//             )}

//             {!isHost && (
//               <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
//                 <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//                 <p className="text-gray-400">Waiting for host to start the test...</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {/* Real-time stats display */}
//             <div className="text-center">
//               <div className="inline-flex items-center gap-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-blue-500">{timeLeft}</div>
//                   <div className="text-sm text-gray-400">seconds</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-green-500">{wpm}</div>
//                   <div className="text-sm text-gray-400">wpm</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-yellow-500">{accuracy}%</div>
//                   <div className="text-sm text-gray-400">accuracy</div>
//                 </div>
//               </div>
//             </div>

//             {/* Live leaderboard during test */}
//             {Object.keys(realtimeResults).length > 0 && (
//               <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
//                 <h4 className="text-lg font-bold text-gray-100 mb-3 text-center">Live Rankings</h4>
//                 <div className="space-y-2">
//                   {Object.entries(realtimeResults)
//                     .sort((a, b) => b[1].wpm - a[1].wpm)
//                     .map(([username, stats], index) => (
//                       <div key={username} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-700">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-3 h-3 rounded-full ${
//                             index === 0 ? 'bg-yellow-500' : 
//                             index === 1 ? 'bg-gray-400' : 
//                             'bg-blue-500'
//                           }`}></div>
//                           <span className="text-gray-100">{username}</span>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-blue-500 font-bold">{stats.wpm} WPM</div>
//                           <div className="text-gray-400 text-sm">{stats.accuracy}% • {Math.round(stats.progress)}%</div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {renderTypingArea()}

//             {/* Final results - shows immediately when available */}
//             {finalResults && showingResults && (
//               <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <h4 className="text-xl font-bold text-gray-100 mb-4 text-center">Final Results</h4>
//                 <div className="space-y-3">
//                   {finalResults
//                     .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
//                     .map((result, index) => (
//                       <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-700">
//                         <div className="flex items-center gap-4">
//                           <div className={`w-4 h-4 rounded-full ${
//                             index === 0 ? 'bg-yellow-500' : 
//                             index === 1 ? 'bg-gray-400' : 
//                             index === 2 ? 'bg-blue-500' : 'bg-gray-600'
//                           }`}></div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-gray-100 font-medium">{result.username}</span>
//                             {index === 0 && (
//                               <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
//                                 WINNER
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-blue-500 font-bold">{result.wpm || 0} WPM</div>
//                           <div className="text-gray-400 text-sm">
//                             {result.accuracy || 0}% accuracy
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ModernTypingApp;





















































































































// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// const SERVER_URL = "https://typingbackend-b2mf.onrender.com";
// const paragraphsData = {
//   words: {
//     "25": [
//       "Reading books improves vocabulary, enhances imagination, and allows people to explore new ideas, cultures, and perspectives from around the world.",
//       "Exercise is essential for maintaining both physical and mental health, reducing stress, improving focus, and promoting overall well-being daily.",
//       "A good night’s sleep helps restore energy, boosts immunity, and supports brain function, which are crucial for leading a healthy and productive life."
//     ],
//     "50": [
//       "The forest was calm and quiet, except for the occasional rustling of leaves and distant chirping of birds. A soft breeze carried the scent of pine, and the sunlight filtered through the branches, creating dancing shadows on the forest floor. It was a perfect place to unwind and reconnect with nature’s beauty and silence.",
//       "Coding is more than just writing instructions for computers; it’s about solving real-world problems and creating efficient, innovative solutions. Learning programming builds logic and creativity, enabling people to turn ideas into reality, automate tasks, and build powerful applications that serve millions around the globe.",
//       "Personal growth is a continuous journey that requires self-reflection, resilience, and courage. Facing challenges, learning from failures, and stepping out of comfort zones help individuals evolve, discover their purpose, and unlock their true potential in both personal and professional life."
//     ],
//     "100": [
//       "Technology is rapidly changing the landscape of every industry, from healthcare and education to transportation and entertainment. Artificial intelligence, automation, and machine learning are streamlining tasks and creating new opportunities. At the same time, cybersecurity and ethical use of data have become vital concerns. As we continue to innovate, it's important to stay aware of how these advancements affect our privacy, job markets, and relationships. With the right balance, technology can empower societies and foster inclusivity, accessibility, and sustainability for generations to come. Preparing for a tech-driven future requires education, adaptability, and global cooperation.",
//       "The rise and fall of ancient civilizations tell us stories of human resilience, creativity, and conflict. From the towering pyramids of Egypt to the intellectual glory of Greece and the engineering marvels of Rome, history holds lessons about governance, power, culture, and innovation. Trade routes connected distant societies, while wars shaped borders and ideologies. The collapse of these civilizations often came from a mix of internal decay and external threats. By studying the past, we not only honor those who came before us but also learn how to avoid repeating mistakes and build stronger futures.",
//       "In the heart of the jungle, where the sun barely touched the forest floor, a hidden tribe thrived for centuries, untouched by modern society. They lived in harmony with nature, using ancient knowledge passed down orally through generations. Their medicine came from plants, their food from the land, and their wisdom from the stars. One day, a young boy ventured too far from the village and discovered a glowing stone buried beneath roots. The elders believed it was a sign of change. That night, the village gathered for a story, unaware that their world was about to transform forever."
//     ],
//     "150": [
//       "Education is the cornerstone of any progressive society. It empowers individuals with knowledge, critical thinking skills, and the confidence to shape their own lives. From the early days of learning the alphabet to advanced fields like quantum physics, education provides the tools needed to understand and improve the world. Modern education systems face challenges like inequality, outdated curricula, and limited access in some regions. However, the rise of online learning platforms and global collaboration among educators has opened up new possibilities. Investing in education, especially for marginalized communities, ensures a more just, innovative, and inclusive world for future generations. The role of teachers, parents, and institutions is essential in fostering curiosity, values, and lifelong learning habits that go far beyond the classroom.",
//       "The human mind is a complex and powerful organ capable of extraordinary feats. It processes emotions, stores memories, and makes decisions that define who we are. Neuroscience has made great strides in understanding how the brain works, revealing how experiences and environments shape behavior. Mental health is a crucial aspect of this conversation, as anxiety, depression, and stress affect millions worldwide. Removing stigma around mental illness and promoting psychological wellness is essential. Practices like mindfulness, therapy, and open dialogue have proven effective. In an age of fast living and information overload, prioritizing mental well-being is not just helpful—it’s vital for a balanced life."
//     ]
//   },

//   punctuation: {
//     short: [
//       "Wait! Did you hear that? Something’s not right. Let’s check it out quickly!",
//       "Sure, I’ll be there! Give me five minutes, and I’ll bring your book too."
//     ],
//     medium: [
//       "Hey, listen! I just got a message from her—she’s arriving today. Can you believe it? After all this time, she finally decided to visit. Isn’t that amazing?",
//       "No way! You actually met him? That’s incredible. I never thought he would show up at the party. What did he say? Was it awkward or fun?"
//     ],
//     long: [
//       "Alright, so here’s the plan: we’ll leave early in the morning, pack enough snacks and water, and make sure to bring the map. The trail isn’t too difficult, but the weather might get unpredictable in the afternoon. Also, don’t forget to charge your phone and bring your ID, just in case. Sound good?",
//       "Well, it’s not that simple, honestly. You see, things have changed a lot since we last talked. People have moved on, jobs have shifted, and not everything is the way it used to be. But that’s okay, right? We adapt, we learn, and we keep moving forward. That’s what matters in the end."
//     ]
//   }
// };


// function ModernTypingApp() {
//   const [category, setCategory] = useState("words");
//   const [subcategory, setSubcategory] = useState("");
//   const [selectedWordCount, setSelectedWordCount] = useState("25");
//   const [timerDuration, setTimerDuration] = useState(60);

//   const [paragraph, setParagraph] = useState("");
//   const [roomCode, setRoomCode] = useState("");
//   const [joinedRoom, setJoinedRoom] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [testStarted, setTestStarted] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [typedText, setTypedText] = useState("");
//   const [timeLeft, setTimeLeft] = useState(timerDuration);
//   const [actualTimeLeft, setActualTimeLeft] = useState(timerDuration + 15);
//   const [wpm, setWpm] = useState(0);
//   const [accuracy, setAccuracy] = useState(100);
//   const [showingResults, setShowingResults] = useState(false);
//   const [finalResults, setFinalResults] = useState(null);
  
//   // NEW: Win/Lose states
//   const [gameResult, setGameResult] = useState(null); // 'won', 'lost', or null
//   const [currentUserRank, setCurrentUserRank] = useState(null);
//   const [sortedResults, setSortedResults] = useState([]);
  
//   // Real-time results storage
//   const [realtimeResults, setRealtimeResults] = useState({});
  
//   // Store test settings
//   const [testSettings, setTestSettings] = useState({
//     category: "words",
//     subcategory: "",
//     wordCount: "25",
//     duration: 60
//   });

//   const socketRef = useRef(null);
//   const intervalRef = useRef(null);
//   const usernameRef = useRef("");
//   const testStartTimeRef = useRef(null);
//   const inputRef = useRef(null);
//   const roomCodeRef = useRef("");
//   const testDurationRef = useRef(60);

//   // NEW: Get real username from localStorage
//   const getRealUsername = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("userData"));
//       return userData?.username || userData?.name || userData?.email?.split('@')[0] || "Anonymous";
//     } catch (error) {
//       console.error("Error getting username from localStorage:", error);
//       return "Anonymous";
//     }
//   };

//   // NEW: Calculate combined score for ranking
//   const calculateCombinedScore = (wpm, accuracy) => {
//     // Formula: 70% WPM + 30% Accuracy
//     return Math.round((wpm * 0.7) + (accuracy * 0.3));
//   };

//   // NEW: Process final results and determine winner/loser
//   const processGameResults = (results) => {
//     if (!results || results.length === 0) return;

//     const currentUsername = usernameRef.current;
    
//     // Calculate combined scores and sort
//     const resultsWithScores = results.map(result => ({
//       ...result,
//       combinedScore: calculateCombinedScore(result.wpm, result.accuracy)
//     }));

//     // Sort by combined score (highest first)
//     const sorted = resultsWithScores.sort((a, b) => b.combinedScore - a.combinedScore);
//     setSortedResults(sorted);

//     // Find current user's position
//     const currentUserIndex = sorted.findIndex(result => result.username === currentUsername);
//     const rank = currentUserIndex + 1;
//     setCurrentUserRank(rank);

//     // Determine if current user won or lost
//     if (rank === 1 && sorted.length > 1) {
//       setGameResult('won');
//     } else if (sorted.length > 1) {
//       setGameResult('lost');
//     } else {
//       setGameResult(null); // Single player or no competition
//     }

//     console.log("Game Results Processed:", {
//       currentUser: currentUsername,
//       rank: rank,
//       totalPlayers: sorted.length,
//       result: rank === 1 && sorted.length > 1 ? 'won' : 'lost',
//       sortedResults: sorted
//     });
//   };

//   useEffect(() => {
//     setTimeLeft(timerDuration);
//     setActualTimeLeft(timerDuration + 15);
//     testDurationRef.current = timerDuration;
//   }, [timerDuration]);

//   // Improved real-time calculation with better timing
//   const calculateRealtimeStats = (currentTypedText, currentParagraph, startTime) => {
//     if (!currentParagraph || !startTime) {
//       return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
//     }

//     const now = Date.now();
//     const elapsedTimeMs = now - startTime;
//     const elapsedTimeMinutes = elapsedTimeMs / (1000 * 60);

//     const typedChars = currentTypedText.length;
//     let correctChars = 0;

//     const compareLength = Math.min(typedChars, currentParagraph.length);
//     for (let i = 0; i < compareLength; i++) {
//       if (currentTypedText[i] === currentParagraph[i]) {
//         correctChars++;
//       }
//     }

//     const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
//     const wpm = elapsedTimeMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeMinutes) : 0;

//     return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
//   };

//   // Calculate final stats at the end of test
//   const calculateFinalStats = (currentTypedText, currentParagraph, duration) => {
//     if (!currentParagraph) {
//       return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
//     }

//     const typedChars = currentTypedText.length;
//     let correctChars = 0;

//     const compareLength = Math.min(typedChars, currentParagraph.length);
//     for (let i = 0; i < compareLength; i++) {
//       if (currentTypedText[i] === currentParagraph[i]) {
//         correctChars++;
//       }
//     }

//     const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
//     const durationMinutes = duration / 60;
//     const wpm = durationMinutes > 0 ? Math.round((correctChars / 5) / durationMinutes) : 0;

//     return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
//   };

//   useEffect(() => {
//     socketRef.current = io(SERVER_URL);

//     socketRef.current.on("room-update", (usernames) => {
//       setUsers(usernames.map((name, index) => ({ id: index, username: name })));
//     });

//     socketRef.current.on("start-test", ({ paragraph: receivedParagraph, startTime, duration, settings }) => {
//       setParagraph(receivedParagraph);
//       setTestStarted(true);
//       setTimeLeft(duration);
//       setActualTimeLeft(duration + 15);
//       setTypedText("");
//       setShowingResults(false);
//       setFinalResults(null);
      
//       // NEW: Reset game result states
//       setGameResult(null);
//       setCurrentUserRank(null);
//       setSortedResults([]);
      
//       setWpm(0);
//       setAccuracy(100);
//       setRealtimeResults({});
//       testDurationRef.current = duration;
      
//       if (settings) {
//         setTestSettings(settings);
//       }
      
//       // Start 3-second countdown
//       setCountdown(3);
//       let countdownInterval = setInterval(() => {
//         setCountdown(prev => {
//           if (prev <= 1) {
//             clearInterval(countdownInterval);
            
//             const now = Date.now();
//             const delay = Math.max(startTime - now, 0);

//             setTimeout(() => {
//               setCountdown(0);
//               testStartTimeRef.current = Date.now();
              
//               intervalRef.current = setInterval(() => {
//                 const currentTime = Date.now();
//                 const elapsed = Math.floor((currentTime - testStartTimeRef.current) / 1000);
//                 const userTimeRemaining = Math.max(duration - elapsed, 0);
//                 const actualTimeRemaining = Math.max((duration + 15) - elapsed, 0);
                
//                 setTimeLeft(userTimeRemaining);
//                 setActualTimeLeft(actualTimeRemaining);

//                 if (userTimeRemaining <= 0 && !showingResults) {
//                   setShowingResults(true);
                  
//                   const currentTypedTextRef = inputRef.current?.value || "";
//                   const finalStats = calculateFinalStats(currentTypedTextRef, receivedParagraph, duration);
                  
//                   console.log("Final stats calculated:", finalStats);
                  
//                   setWpm(finalStats.wpm);
//                   setAccuracy(finalStats.accuracy);
                  
//                   const finalResult = {
//                     username: usernameRef.current,
//                     wpm: finalStats.wpm,
//                     accuracy: finalStats.accuracy,
//                     correctChars: finalStats.correctChars,
//                     totalChars: finalStats.totalChars,
//                     completed: true
//                   };
                  
//                   console.log("Emitting final result:", finalResult);
                  
//                   socketRef.current.emit("submit-result", {
//                     roomCode: roomCodeRef.current,
//                     username: usernameRef.current,
//                     result: finalResult
//                   });
//                 }

//                 if (actualTimeRemaining <= 0) {
//                   clearInterval(intervalRef.current);
//                 }
//               }, 1000);
//             }, delay);
            
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     });

//     socketRef.current.on("realtime-update", (data) => {
//       setRealtimeResults(prev => ({
//         ...prev,
//         [data.username]: data.stats
//       }));
//     });

//     // NEW: Enhanced results processing with win/lose logic
//     socketRef.current.on("results", (results) => {
//       console.log("Received final results:", results);
//       setFinalResults(results);
      
//       // Process results to determine winner/loser
//       processGameResults(results);
//     });

//     return () => {
//       socketRef.current.disconnect();
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   const getRandomParagraph = () => {
//     if (category === "words") {
//       const options = paragraphsData.words[selectedWordCount] || [];
//       if (options.length === 0) return "No paragraph found for this word count.";
//       const randomIndex = Math.floor(Math.random() * options.length);
//       return options[randomIndex];
//     } else {
//       if (!subcategory) return "Please select a subcategory.";
//       const options = paragraphsData[category]?.[subcategory] || [];
//       if (options.length === 0) return "No paragraph found for this subcategory.";
//       const randomIndex = Math.floor(Math.random() * options.length);
//       return options[randomIndex];
//     }
//   };

//   // UPDATED: Use real username instead of random names
//   const handleCreateRoom = () => {
//     const realUsername = getRealUsername();
//     usernameRef.current = realUsername;
//     setIsHost(true);

//     const randomPara = getRandomParagraph();
//     setParagraph(randomPara);

//     const currentSettings = {
//       category,
//       subcategory,
//       wordCount: selectedWordCount,
//       duration: timerDuration
//     };
//     setTestSettings(currentSettings);

//     socketRef.current.emit("create-room", { username: realUsername }, ({ roomCode }) => {
//       setRoomCode(roomCode);
//       roomCodeRef.current = roomCode;
//       setJoinedRoom(true);
//     });
//   };

//   // UPDATED: Use real username instead of random names
//   const handleJoinRoom = () => {
//     if (!roomCode.trim()) {
//       alert("Please enter a room code.");
//       return;
//     }

//     const realUsername = getRealUsername();
//     usernameRef.current = realUsername;
//     setIsHost(false);

//     socketRef.current.emit("join-room", { username: realUsername, roomCode }, ({ success, error }) => {
//       if (!success) {
//         alert(error || "Failed to join room.");
//         return;
//       }
//       setRoomCode(roomCode);
//       roomCodeRef.current = roomCode;
//       setJoinedRoom(true);
//     });
//   };

//   const handleStartTest = () => {
//     if (!isHost) return;
    
//     const currentSettings = {
//       category,
//       subcategory,
//       wordCount: selectedWordCount,
//       duration: timerDuration
//     };
    
//     socketRef.current.emit("start-test", { 
//       roomCode: roomCodeRef.current, 
//       paragraph, 
//       duration: timerDuration,
//       settings: currentSettings 
//     });
//   };

//   const handleTyping = (e) => {
//     if (timeLeft === 0 || countdown > 0) return;
    
//     const newTypedText = e.target.value;
//     setTypedText(newTypedText);
    
//     if (testStartTimeRef.current) {
//       const stats = calculateRealtimeStats(newTypedText, paragraph, testStartTimeRef.current);
//       setWpm(stats.wpm);
//       setAccuracy(stats.accuracy);
      
//       if (newTypedText.length % 3 === 0 || newTypedText.length === 1) {
//         socketRef.current.emit("realtime-stats", {
//           roomCode: roomCodeRef.current,
//           username: usernameRef.current,
//           stats: {
//             wpm: stats.wpm,
//             accuracy: stats.accuracy,
//             progress: Math.min((newTypedText.length / paragraph.length) * 100, 100)
//           }
//         });
//       }
//     }
//   };

//   const subcategoryOptions = {
//     punctuation: ["short", "medium", "long"],
//     numbers: ["short", "medium", "long"],
//     quotes: ["short", "medium", "long"],
//   };

//   // NEW: Helper functions for components to access game state
//   const getGameResultData = () => ({
//     gameResult, // 'won', 'lost', or null
//     currentUserRank,
//     currentUserName: usernameRef.current,
//     sortedResults,
//     totalPlayers: sortedResults.length,
//     showingResults,
//     finalResults
//   });




// const renderTypingArea = () => {
//     if (!paragraph) return null;

//     return (
//       <div className="relative max-w-7xl mx-auto">
//         <div className="bg-gray-900 rounded-lg p-12 min-h-[400px] relative overflow-hidden">
//           <div className="font-sans text-3xl leading-loose text-center max-w-6xl mx-auto">
//             {paragraph.split('').map((char, index) => {
//               let className = 'text-gray-500'; // Medium gray for untyped text
              
//               if (index < typedText.length) {
//                 if (typedText[index] === char) {
//                   className = 'text-gray-200'; // Light gray for correct characters
//                 } else {
//                   className = 'text-red-400 bg-red-400/20'; // Red for errors
//                 }
//               } else if (index === typedText.length) {
//                 className = 'text-gray-200 bg-gray-200/20'; // Current cursor position - removed animate-pulse
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
//             value={typedText}
//             onChange={handleTyping}
//             disabled={timeLeft === 0 || countdown > 0}
//             className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
//             style={{ caretColor: 'transparent' }}
//             autoFocus
//             spellCheck={false}
//           />
//         </div>
        
//         {/* Countdown overlay - removed animation */}
//         {countdown > 0 && (
//           <div className="absolute inset-0 bg-gray-900/90 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-8xl font-bold text-yellow-500 mb-4">
//                 {countdown}
//               </div>
//               <div className="text-xl text-gray-300">Get Ready...</div>
//             </div>
//           </div>
//         )}
        
//         {/* Results overlay - shows immediately when timer ends */}
//         {showingResults && timeLeft === 0 && countdown === 0 && (
//           <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-yellow-500 mb-2">{wpm}</div>
//               <div className="text-gray-300">Words Per Minute</div>
//               <div className="text-2xl font-bold text-green-500 mt-2">{accuracy}%</div>
//               <div className="text-gray-300">Accuracy</div>
//               <div className="text-sm text-gray-400 mt-4">
//                 Final results calculating...
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!joinedRoom) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-8">
//         <div className="max-w-6xl w-full">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
//               TypingTest
//             </h1>
//             <p className="text-gray-400 text-lg">Modern multiplayer typing test</p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
//             <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
//               <h2 className="text-2xl font-bold text-blue-500 mb-6">Create Room</h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
//                   <select
//                     value={category}
//                     onChange={(e) => {
//                       setCategory(e.target.value);
//                       setSubcategory("");
//                       setSelectedWordCount("25");
//                     }}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     {Object.keys(paragraphsData).map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {category === "words" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
//                     <select
//                       value={selectedWordCount}
//                       onChange={(e) => setSelectedWordCount(e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       {Object.keys(paragraphsData.words).map((count) => (
//                         <option key={count} value={count}>
//                           {count} words
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {category !== "words" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
//                     <select
//                       value={subcategory}
//                       onChange={(e) => setSubcategory(e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">-- Select --</option>
//                       {subcategoryOptions[category]?.map((subcat) => (
//                         <option key={subcat} value={subcat}>
//                           {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Timer Duration</label>
//                   <select
//                     value={timerDuration}
//                     onChange={(e) => setTimerDuration(Number(e.target.value))}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     {[15, 30, 45, 60, 120].map((time) => (
//                       <option key={time} value={time}>
//                         {time} seconds
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button 
//                   onClick={handleCreateRoom}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   Create Room
//                 </button>
//               </div>
//             </div>

//             <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
//               <h2 className="text-2xl font-bold text-green-500 mb-6">Join Room</h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Room Code</label>
//                   <input
//                     type="text"
//                     value={roomCode}
//                     onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
//                     placeholder="Enter 6-digit code"
//                     maxLength={6}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
//                   />
//                 </div>

//                 <button 
//                   onClick={handleJoinRoom}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   Join Room
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="bg-gray-800 border-b border-gray-700 p-4">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//             TypingTest
//           </h1>
//           <div className="flex items-center gap-4 text-sm">
//             <span className="text-gray-400">Room:</span>
//             <span className="bg-gray-700 px-3 py-1 rounded-lg font-mono text-blue-400 border border-gray-700">{roomCode}</span>
//             <span className="text-gray-300">{isHost ? 'Host' : 'Guest'}</span>
//             {isHost && <span className="text-yellow-500">👑</span>}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-8">
//         {!testStarted ? (
//           <div className="text-center">
//             <div className="mb-8">
//               <div className="inline-flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                   <span className="text-gray-300">Timer: {timerDuration}s</span>
//                 </div>
//                 <div className="w-px h-4 bg-gray-600"></div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span className="text-gray-300">Category: {category}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Simplified Lobby - Just usernames */}
//             <div className="mb-8">
//               <h3 className="text-lg font-medium text-gray-300 mb-4">Players in Room</h3>
//               <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <div className="space-y-2">
//                   {users.map((user) => (
//                     <div key={user.id} className="bg-gray-700 px-4 py-3 rounded-lg border border-gray-600">
//                       <span className="text-gray-100 font-medium">{user.username}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {isHost && (
//               <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//                 <h4 className="text-lg font-medium text-gray-100 mb-4">Preview Text</h4>
//                 <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-left">
//                   <p className="text-gray-400 leading-relaxed">{paragraph || "No paragraph loaded"}</p>
//                 </div>
//                 <button 
//                   onClick={handleStartTest}
//                   disabled={users.length < 2}
//                   className={`mt-6 font-medium py-3 px-8 rounded-lg focus:outline-none focus:ring-2 ${
//                     users.length < 2 
//                       ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-700' 
//                       : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
//                   }`}
//                 >
//                   {users.length < 2 ? 'Waiting for 2 players...' : 'Start Test'}
//                 </button>
//               </div>
//             )}

//             {!isHost && (
//               <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
//                 <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//                 <p className="text-gray-400">Waiting for host to start the test...</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {/* Real-time stats display */}
//             <div className="text-center">
//               <div className="inline-flex items-center gap-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-blue-500">{timeLeft}</div>
//                   <div className="text-sm text-gray-400">seconds</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-green-500">{wpm}</div>
//                   <div className="text-sm text-gray-400">wpm</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-yellow-500">{accuracy}%</div>
//                   <div className="text-sm text-gray-400">accuracy</div>
//                 </div>
//               </div>
//             </div>

//             {/* Simplified Live leaderboard - Just usernames and stats */}
//             {Object.keys(realtimeResults).length > 0 && (
//               <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
//                 <h4 className="text-lg font-bold text-gray-100 mb-3 text-center">Live Rankings</h4>
//                 <div className="space-y-2">
//                   {Object.entries(realtimeResults)
//                     .sort((a, b) => b[1].wpm - a[1].wpm)
//                     .map(([username, stats], index) => (
//                       <div key={username} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600">
//                         <div className="flex items-center gap-3">
//                           <span className="text-gray-300 font-mono w-6">#{index + 1}</span>
//                           <span className="text-gray-100 font-medium">{username}</span>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-blue-500 font-bold">{stats.wpm} WPM</div>
//                           <div className="text-gray-400 text-sm">{stats.accuracy}%</div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {renderTypingArea()}

//             {/* Simplified Final results - Just usernames and stats */}
//             {finalResults && showingResults && (
//               <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <h4 className="text-xl font-bold text-gray-100 mb-4 text-center">Final Results</h4>
//                 <div className="space-y-3">
//                   {finalResults
//                     .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
//                     .map((result, index) => (
//                       <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-600">
//                         <div className="flex items-center gap-4">
//                           <span className="text-gray-300 font-mono w-8">#{index + 1}</span>
//                           <div className="flex items-center gap-2">
//                             <span className="text-gray-100 font-medium">{result.username}</span>
//                             {index === 0 && (
//                               <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold">
//                                 WINNER
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-blue-500 font-bold">{result.wpm || 0} WPM</div>
//                           <div className="text-gray-400 text-sm">
//                             {result.accuracy || 0}% accuracy
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ModernTypingApp;










// -----------------------------------------------------------------------------































// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// const SERVER_URL = "https://typingbackend-b2mf.onrender.com";
// const paragraphsData = {
//   words: {
//     "25": [
//       "Reading books improves vocabulary, enhances imagination, and allows people to explore new ideas, cultures, and perspectives from around the world.",
//       "Exercise is essential for maintaining both physical and mental health, reducing stress, improving focus, and promoting overall well-being daily.",
//       "A good night’s sleep helps restore energy, boosts immunity, and supports brain function, which are crucial for leading a healthy and productive life."
//     ],
//     "50": [
//       "The forest was calm and quiet, except for the occasional rustling of leaves and distant chirping of birds. A soft breeze carried the scent of pine, and the sunlight filtered through the branches, creating dancing shadows on the forest floor. It was a perfect place to unwind and reconnect with nature’s beauty and silence.",
//       "Coding is more than just writing instructions for computers; it’s about solving real-world problems and creating efficient, innovative solutions. Learning programming builds logic and creativity, enabling people to turn ideas into reality, automate tasks, and build powerful applications that serve millions around the globe.",
//       "Personal growth is a continuous journey that requires self-reflection, resilience, and courage. Facing challenges, learning from failures, and stepping out of comfort zones help individuals evolve, discover their purpose, and unlock their true potential in both personal and professional life."
//     ],
//     "100": [
//       "Technology is rapidly changing the landscape of every industry, from healthcare and education to transportation and entertainment. Artificial intelligence, automation, and machine learning are streamlining tasks and creating new opportunities. At the same time, cybersecurity and ethical use of data have become vital concerns. As we continue to innovate, it's important to stay aware of how these advancements affect our privacy, job markets, and relationships. With the right balance, technology can empower societies and foster inclusivity, accessibility, and sustainability for generations to come. Preparing for a tech-driven future requires education, adaptability, and global cooperation.",
//       "The rise and fall of ancient civilizations tell us stories of human resilience, creativity, and conflict. From the towering pyramids of Egypt to the intellectual glory of Greece and the engineering marvels of Rome, history holds lessons about governance, power, culture, and innovation. Trade routes connected distant societies, while wars shaped borders and ideologies. The collapse of these civilizations often came from a mix of internal decay and external threats. By studying the past, we not only honor those who came before us but also learn how to avoid repeating mistakes and build stronger futures.",
//       "In the heart of the jungle, where the sun barely touched the forest floor, a hidden tribe thrived for centuries, untouched by modern society. They lived in harmony with nature, using ancient knowledge passed down orally through generations. Their medicine came from plants, their food from the land, and their wisdom from the stars. One day, a young boy ventured too far from the village and discovered a glowing stone buried beneath roots. The elders believed it was a sign of change. That night, the village gathered for a story, unaware that their world was about to transform forever."
//     ],
//     "150": [
//       "Education is the cornerstone of any progressive society. It empowers individuals with knowledge, critical thinking skills, and the confidence to shape their own lives. From the early days of learning the alphabet to advanced fields like quantum physics, education provides the tools needed to understand and improve the world. Modern education systems face challenges like inequality, outdated curricula, and limited access in some regions. However, the rise of online learning platforms and global collaboration among educators has opened up new possibilities. Investing in education, especially for marginalized communities, ensures a more just, innovative, and inclusive world for future generations. The role of teachers, parents, and institutions is essential in fostering curiosity, values, and lifelong learning habits that go far beyond the classroom.",
//       "The human mind is a complex and powerful organ capable of extraordinary feats. It processes emotions, stores memories, and makes decisions that define who we are. Neuroscience has made great strides in understanding how the brain works, revealing how experiences and environments shape behavior. Mental health is a crucial aspect of this conversation, as anxiety, depression, and stress affect millions worldwide. Removing stigma around mental illness and promoting psychological wellness is essential. Practices like mindfulness, therapy, and open dialogue have proven effective. In an age of fast living and information overload, prioritizing mental well-being is not just helpful—it’s vital for a balanced life."
//     ]
//   },

//   punctuation: {
//     short: [
//       "Wait! Did you hear that? Something’s not right. Let’s check it out quickly!",
//       "Sure, I’ll be there! Give me five minutes, and I’ll bring your book too."
//     ],
//     medium: [
//       "Hey, listen! I just got a message from her—she’s arriving today. Can you believe it? After all this time, she finally decided to visit. Isn’t that amazing?",
//       "No way! You actually met him? That’s incredible. I never thought he would show up at the party. What did he say? Was it awkward or fun?"
//     ],
//     long: [
//       "Alright, so here’s the plan: we’ll leave early in the morning, pack enough snacks and water, and make sure to bring the map. The trail isn’t too difficult, but the weather might get unpredictable in the afternoon. Also, don’t forget to charge your phone and bring your ID, just in case. Sound good?",
//       "Well, it’s not that simple, honestly. You see, things have changed a lot since we last talked. People have moved on, jobs have shifted, and not everything is the way it used to be. But that’s okay, right? We adapt, we learn, and we keep moving forward. That’s what matters in the end."
//     ]
//   }
// };


// function ModernTypingApp() {
//   const [category, setCategory] = useState("words");
//   const [subcategory, setSubcategory] = useState("");
//   const [selectedWordCount, setSelectedWordCount] = useState("25");
//   const [timerDuration, setTimerDuration] = useState(60);

//   const [paragraph, setParagraph] = useState("");
//   const [roomCode, setRoomCode] = useState("");
//   const [joinedRoom, setJoinedRoom] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [testStarted, setTestStarted] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [typedText, setTypedText] = useState("");
//   const [timeLeft, setTimeLeft] = useState(timerDuration);
//   const [actualTimeLeft, setActualTimeLeft] = useState(timerDuration + 15);
//   const [wpm, setWpm] = useState(0);
//   const [accuracy, setAccuracy] = useState(100);
//   const [showingResults, setShowingResults] = useState(false);
//   const [finalResults, setFinalResults] = useState(null);
  
//   // NEW: Win/Lose states
//   const [gameResult, setGameResult] = useState(null); // 'won', 'lost', or null
//   const [currentUserRank, setCurrentUserRank] = useState(null);
//   const [sortedResults, setSortedResults] = useState([]);
  
//   // Real-time results storage
//   const [realtimeResults, setRealtimeResults] = useState({});
  
//   // Store test settings
//   const [testSettings, setTestSettings] = useState({
//     category: "words",
//     subcategory: "",
//     wordCount: "25",
//     duration: 60
//   });

//   const socketRef = useRef(null);
//   const intervalRef = useRef(null);
//   const usernameRef = useRef("");
//   const testStartTimeRef = useRef(null);
//   const inputRef = useRef(null);
//   const roomCodeRef = useRef("");
//   const testDurationRef = useRef(60);

//   // NEW: Get real username from localStorage
//   const getRealUsername = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("userData"));
//       return userData?.username || userData?.name || userData?.email?.split('@')[0] || "Anonymous";
//     } catch (error) {
//       console.error("Error getting username from localStorage:", error);
//       return "Anonymous";
//     }
//   };

//   // NEW: Calculate combined score for ranking
//   const calculateCombinedScore = (wpm, accuracy) => {
//     // Formula: 70% WPM + 30% Accuracy
//     return Math.round((wpm * 0.7) + (accuracy * 0.3));
//   };

//   // NEW: Process final results and determine winner/loser
//   const processGameResults = (results) => {
//     if (!results || results.length === 0) return;

//     const currentUsername = usernameRef.current;
    
    
//     const resultsWithScores = results.map(result => ({
//       ...result,
//       combinedScore: calculateCombinedScore(result.wpm, result.accuracy)
//     }));

    
//     const sorted = resultsWithScores.sort((a, b) => b.combinedScore - a.combinedScore);
//     setSortedResults(sorted);

//     // Find current user's position
//     const currentUserIndex = sorted.findIndex(result => result.username === currentUsername);
//     const rank = currentUserIndex + 1;
//     setCurrentUserRank(rank);

//     // Determine if current user won or lost
//     if (rank === 1 && sorted.length > 1) {
//       setGameResult('won');
//     } else if (sorted.length > 1) {
//       setGameResult('lost');
//     } else {
//       setGameResult(null); 
//     }

//     console.log("Game Results Processed:", {
//       currentUser: currentUsername,
//       rank: rank,
//       totalPlayers: sorted.length,
//       result: rank === 1 && sorted.length > 1 ? 'won' : 'lost',
//       sortedResults: sorted
//     });
//   };

//   useEffect(() => {
//     setTimeLeft(timerDuration);
//     setActualTimeLeft(timerDuration + 15);
//     testDurationRef.current = timerDuration;
//   }, [timerDuration]);

  
//   const calculateRealtimeStats = (currentTypedText, currentParagraph, startTime) => {
//     if (!currentParagraph || !startTime) {
//       return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
//     }

//     const now = Date.now();
//     const elapsedTimeMs = now - startTime;
//     const elapsedTimeMinutes = elapsedTimeMs / (1000 * 60);

//     const typedChars = currentTypedText.length;
//     let correctChars = 0;

//     const compareLength = Math.min(typedChars, currentParagraph.length);
//     for (let i = 0; i < compareLength; i++) {
//       if (currentTypedText[i] === currentParagraph[i]) {
//         correctChars++;
//       }
//     }

//     const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
//     const wpm = elapsedTimeMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeMinutes) : 0;

//     return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
//   };

//   // Calculate final stats at the end of test
//   const calculateFinalStats = (currentTypedText, currentParagraph, duration) => {
//     if (!currentParagraph) {
//       return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
//     }

//     const typedChars = currentTypedText.length;
//     let correctChars = 0;

//     const compareLength = Math.min(typedChars, currentParagraph.length);
//     for (let i = 0; i < compareLength; i++) {
//       if (currentTypedText[i] === currentParagraph[i]) {
//         correctChars++;
//       }
//     }

//     const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
//     const durationMinutes = duration / 60;
//     const wpm = durationMinutes > 0 ? Math.round((correctChars / 5) / durationMinutes) : 0;

//     return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
//   };

//   useEffect(() => {
//     socketRef.current = io(SERVER_URL);

//     socketRef.current.on("room-update", (usernames) => {
//       setUsers(usernames.map((name, index) => ({ id: index, username: name })));
//     });

//     socketRef.current.on("start-test", ({ paragraph: receivedParagraph, startTime, duration, settings }) => {
//       setParagraph(receivedParagraph);
//       setTestStarted(true);
//       setTimeLeft(duration);
//       setActualTimeLeft(duration + 15);
//       setTypedText("");
//       setShowingResults(false);
//       setFinalResults(null);
      
//       // NEW: Reset game result states
//       setGameResult(null);
//       setCurrentUserRank(null);
//       setSortedResults([]);
      
//       setWpm(0);
//       setAccuracy(100);
//       setRealtimeResults({});
//       testDurationRef.current = duration;
      
//       if (settings) {
//         setTestSettings(settings);
//       }
      
//       // Start 3-second countdown
//       setCountdown(3);
//       let countdownInterval = setInterval(() => {
//         setCountdown(prev => {
//           if (prev <= 1) {
//             clearInterval(countdownInterval);
            
//             const now = Date.now();
//             const delay = Math.max(startTime - now, 0);

//             setTimeout(() => {
//               setCountdown(0);
//               testStartTimeRef.current = Date.now();
              
//               intervalRef.current = setInterval(() => {
//                 const currentTime = Date.now();
//                 const elapsed = Math.floor((currentTime - testStartTimeRef.current) / 1000);
//                 const userTimeRemaining = Math.max(duration - elapsed, 0);
//                 const actualTimeRemaining = Math.max((duration + 15) - elapsed, 0);
                
//                 setTimeLeft(userTimeRemaining);
//                 setActualTimeLeft(actualTimeRemaining);

//                 if (userTimeRemaining <= 0 && !showingResults) {
//                   setShowingResults(true);
                  
//                   const currentTypedTextRef = inputRef.current?.value || "";
//                   const finalStats = calculateFinalStats(currentTypedTextRef, receivedParagraph, duration);
                  
//                   console.log("Final stats calculated:", finalStats);
                  
//                   setWpm(finalStats.wpm);
//                   setAccuracy(finalStats.accuracy);
                  
//                   const finalResult = {
//                     username: usernameRef.current,
//                     wpm: finalStats.wpm,
//                     accuracy: finalStats.accuracy,
//                     correctChars: finalStats.correctChars,
//                     totalChars: finalStats.totalChars,
//                     completed: true
//                   };
                  
//                   console.log("Emitting final result:", finalResult);
                  
//                   socketRef.current.emit("submit-result", {
//                     roomCode: roomCodeRef.current,
//                     username: usernameRef.current,
//                     result: finalResult
//                   });
//                 }

//                 if (actualTimeRemaining <= 0) {
//                   clearInterval(intervalRef.current);
//                 }
//               }, 1000);
//             }, delay);
            
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     });

//     socketRef.current.on("realtime-update", (data) => {
//       setRealtimeResults(prev => ({
//         ...prev,
//         [data.username]: data.stats
//       }));
//     });

//     // NEW: Enhanced results processing with win/lose logic
//     socketRef.current.on("results", (results) => {
//       console.log("Received final results:", results);
//       setFinalResults(results);
      
//       // Process results to determine winner/loser
//       processGameResults(results);
//     });

//     return () => {
//       socketRef.current.disconnect();
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   const getRandomParagraph = () => {
//     if (category === "words") {
//       const options = paragraphsData.words[selectedWordCount] || [];
//       if (options.length === 0) return "No paragraph found for this word count.";
//       const randomIndex = Math.floor(Math.random() * options.length);
//       return options[randomIndex];
//     } else {
//       if (!subcategory) return "Please select a subcategory.";
//       const options = paragraphsData[category]?.[subcategory] || [];
//       if (options.length === 0) return "No paragraph found for this subcategory.";
//       const randomIndex = Math.floor(Math.random() * options.length);
//       return options[randomIndex];
//     }
//   };

//   // UPDATED: Use real username instead of random names
//   const handleCreateRoom = () => {
//     const realUsername = getRealUsername();
//     usernameRef.current = realUsername;
//     setIsHost(true);

//     const randomPara = getRandomParagraph();
//     setParagraph(randomPara);

//     const currentSettings = {
//       category,
//       subcategory,
//       wordCount: selectedWordCount,
//       duration: timerDuration
//     };
//     setTestSettings(currentSettings);

//     socketRef.current.emit("create-room", { username: realUsername }, ({ roomCode }) => {
//       setRoomCode(roomCode);
//       roomCodeRef.current = roomCode;
//       setJoinedRoom(true);
//     });
//   };

//   // UPDATED: Use real username instead of random names
//   const handleJoinRoom = () => {
//     if (!roomCode.trim()) {
//       alert("Please enter a room code.");
//       return;
//     }

//     const realUsername = getRealUsername();
//     usernameRef.current = realUsername;
//     setIsHost(false);

//     socketRef.current.emit("join-room", { username: realUsername, roomCode }, ({ success, error }) => {
//       if (!success) {
//         alert(error || "Failed to join room.");
//         return;
//       }
//       setRoomCode(roomCode);
//       roomCodeRef.current = roomCode;
//       setJoinedRoom(true);
//     });
//   };

//   const handleStartTest = () => {
//     if (!isHost) return;
    
//     const currentSettings = {
//       category,
//       subcategory,
//       wordCount: selectedWordCount,
//       duration: timerDuration
//     };
    
//     socketRef.current.emit("start-test", { 
//       roomCode: roomCodeRef.current, 
//       paragraph, 
//       duration: timerDuration,
//       settings: currentSettings 
//     });
//   };

//   const handleTyping = (e) => {
//     if (timeLeft === 0 || countdown > 0) return;
    
//     const newTypedText = e.target.value;
//     setTypedText(newTypedText);
    
//     if (testStartTimeRef.current) {
//       const stats = calculateRealtimeStats(newTypedText, paragraph, testStartTimeRef.current);
//       setWpm(stats.wpm);
//       setAccuracy(stats.accuracy);
      
//       if (newTypedText.length % 3 === 0 || newTypedText.length === 1) {
//         socketRef.current.emit("realtime-stats", {
//           roomCode: roomCodeRef.current,
//           username: usernameRef.current,
//           stats: {
//             wpm: stats.wpm,
//             accuracy: stats.accuracy,
//             progress: Math.min((newTypedText.length / paragraph.length) * 100, 100)
//           }
//         });
//       }
//     }
//   };

//   const subcategoryOptions = {
//     punctuation: ["short", "medium", "long"],
//     numbers: ["short", "medium", "long"],
//     quotes: ["short", "medium", "long"],
//   };

//   // NEW: Helper functions for components to access game state
//   const getGameResultData = () => ({
//     gameResult, // 'won', 'lost', or null
//     currentUserRank,
//     currentUserName: usernameRef.current,
//     sortedResults,
//     totalPlayers: sortedResults.length,
//     showingResults,
//     finalResults
//   });
// const renderTypingArea = () => {
//     if (!paragraph) return null;

//     return (
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-gray-900 rounded-lg p-4 sm:p-8 lg:p-12 min-h-[300px] sm:min-h-[400px] relative overflow-hidden">
//           <div className="font-sans text-lg sm:text-xl lg:text-3xl leading-relaxed sm:leading-loose text-center max-w-6xl mx-auto">
//             {paragraph.split('').map((char, index) => {
//               let className = 'text-gray-500'; 
              
//               if (index < typedText.length) {
//                 if (typedText[index] === char) {
//                   className = 'text-gray-200'; 
//                 } else {
//                   className = 'text-red-400 bg-red-400/20'; 
//                 }
//               } else if (index === typedText.length) {
//                 className = 'text-gray-200 bg-gray-200/20'; 
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
//             value={typedText}
//             onChange={handleTyping}
//             disabled={timeLeft === 0 || countdown > 0}
//             className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
//             style={{ caretColor: 'transparent' }}
//             autoFocus
//             spellCheck={false}
//           />
//         </div>
        
//         {/* Countdown overlay - removed animation */}
//         {countdown > 0 && (
//           <div className="absolute inset-0 bg-gray-900/90 rounded-lg flex items-center justify-center">
//             <div className="text-center px-4">
//               <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-yellow-500 mb-2 sm:mb-4">
//                 {countdown}
//               </div>
//               <div className="text-lg sm:text-xl text-gray-300">Get Ready...</div>
//             </div>
//           </div>
//         )}
        
//         {/* Results overlay - shows immediately when timer ends */}
//         {showingResults && timeLeft === 0 && countdown === 0 && (
//           <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
//             <div className="text-center px-4">
//               <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">{wpm}</div>
//               <div className="text-sm sm:text-base text-gray-300">Words Per Minute</div>
//               <div className="text-xl sm:text-2xl font-bold text-green-500 mt-2">{accuracy}%</div>
//               <div className="text-sm sm:text-base text-gray-300">Accuracy</div>
//               <div className="text-xs sm:text-sm text-gray-400 mt-4">
//                 Final results calculating...
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!joinedRoom) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 sm:p-8">
//         <div className="max-w-6xl w-full">
//           <div className="text-center mb-8 sm:mb-12">
//             <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
//               TypingTest
//             </h1>
//             <p className="text-gray-400 text-base sm:text-lg">Modern multiplayer typing test</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
//             <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
//               <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4 sm:mb-6">Create Room</h2>
              
//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
//                   <select
//                     value={category}
//                     onChange={(e) => {
//                       setCategory(e.target.value);
//                       setSubcategory("");
//                       setSelectedWordCount("25");
//                     }}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//                   >
//                     {Object.keys(paragraphsData).map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {category === "words" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
//                     <select
//                       value={selectedWordCount}
//                       onChange={(e) => setSelectedWordCount(e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//                     >
//                       {Object.keys(paragraphsData.words).map((count) => (
//                         <option key={count} value={count}>
//                           {count} words
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {category !== "words" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
//                     <select
//                       value={subcategory}
//                       onChange={(e) => setSubcategory(e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//                     >
//                       <option value="">-- Select --</option>
//                       {subcategoryOptions[category]?.map((subcat) => (
//                         <option key={subcat} value={subcat}>
//                           {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Timer Duration</label>
//                   <select
//                     value={timerDuration}
//                     onChange={(e) => setTimerDuration(Number(e.target.value))}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//                   >
//                     {[15, 30, 45, 60, 120].map((time) => (
//                       <option key={time} value={time}>
//                         {time} seconds
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button 
//                   onClick={handleCreateRoom}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                 >
//                   Create Room
//                 </button>
//               </div>
//             </div>

//             <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
//               <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-4 sm:mb-6">Join Room</h2>
              
//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Room Code</label>
//                   <input
//                     type="text"
//                     value={roomCode}
//                     onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
//                     placeholder="Enter 6-digit code"
//                     maxLength={6}
//                     className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg sm:text-2xl tracking-widest font-mono"
//                   />
//                 </div>

//                 <button 
//                   onClick={handleJoinRoom}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                 >
//                   Join Room
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="bg-gray-800 border-b border-gray-700 p-3 sm:p-4">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//             TypingTest
//           </h1>
//           <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
//             <span className="text-gray-400 hidden sm:inline">Room:</span>
//             <span className="bg-gray-700 px-2 sm:px-3 py-1 rounded-lg font-mono text-blue-400 border border-gray-700 text-xs sm:text-sm">{roomCode}</span>
//             <span className="text-gray-300 hidden sm:inline">{isHost ? 'Host' : 'Guest'}</span>
//             {isHost && <span className="text-yellow-500">👑</span>}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-4 sm:p-8">
//         {!testStarted ? (
//           <div className="text-center">
//             <div className="mb-6 sm:mb-8">
//               <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                   <span className="text-gray-300 text-sm sm:text-base">Timer: {timerDuration}s</span>
//                 </div>
//                 <div className="w-4 h-px sm:w-px sm:h-4 bg-gray-600"></div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span className="text-gray-300 text-sm sm:text-base">Category: {category}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Simplified Lobby - Just usernames */}
//             <div className="mb-6 sm:mb-8">
//               <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-4">Players in Room</h3>
//               <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
//                 <div className="space-y-2">
//                   {users.map((user) => (
//                     <div key={user.id} className="bg-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-600">
//                       <span className="text-gray-100 font-medium text-sm sm:text-base">{user.username}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {isHost && (
//               <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 mb-6 sm:mb-8">
//                 <h4 className="text-base sm:text-lg font-medium text-gray-100 mb-4">Preview Text</h4>
//                 <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700 text-left">
//                   <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{paragraph || "No paragraph loaded"}</p>
//                 </div>
//                 <button 
//                   onClick={handleStartTest}
//                   disabled={users.length < 2}
//                   className={`mt-4 sm:mt-6 font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base ${
//                     users.length < 2 
//                       ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-700' 
//                       : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
//                   }`}
//                 >
//                   {users.length < 2 ? 'Waiting for 2 players...' : 'Start Test'}
//                 </button>
//               </div>
//             )}

//             {!isHost && (
//               <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
//                 <p className="text-gray-400 text-sm sm:text-base">Waiting for host to start the test...</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6 sm:space-y-8">
//             {/* Real-time stats display */}
//             <div className="text-center">
//               <div className="inline-flex items-center gap-4 sm:gap-8 bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-blue-500">{timeLeft}</div>
//                   <div className="text-xs sm:text-sm text-gray-400">seconds</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-green-500">{wpm}</div>
//                   <div className="text-xs sm:text-sm text-gray-400">wpm</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-yellow-500">{accuracy}%</div>
//                   <div className="text-xs sm:text-sm text-gray-400">accuracy</div>
//                 </div>
//               </div>
//             </div>

//             {/* Simplified Live leaderboard - Just usernames and stats */}
//             {Object.keys(realtimeResults).length > 0 && (
//               <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
//                 <h4 className="text-base sm:text-lg font-bold text-gray-100 mb-3 text-center">Live Rankings</h4>
//                 <div className="space-y-2">
//                   {Object.entries(realtimeResults)
//                     .sort((a, b) => b[1].wpm - a[1].wpm)
//                     .map(([username, stats], index) => (
//                       <div key={username} className="flex justify-between items-center bg-gray-700 p-2 sm:p-3 rounded-lg border border-gray-600">
//                         <div className="flex items-center gap-2 sm:gap-3">
//                           <span className="text-gray-300 font-mono w-4 sm:w-6 text-sm sm:text-base">#{index + 1}</span>
//                           <span className="text-gray-100 font-medium text-sm sm:text-base">{username}</span>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-blue-500 font-bold text-sm sm:text-base">{stats.wpm} WPM</div>
//                           <div className="text-gray-400 text-xs sm:text-sm">{stats.accuracy}%</div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {renderTypingArea()}

//             {/* Simplified Final results - Just usernames and stats */}
//             {finalResults && showingResults && (
//               <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
//                 <h4 className="text-lg sm:text-xl font-bold text-gray-100 mb-4 text-center">Final Results</h4>
//                 <div className="space-y-3">
//                   {finalResults
//                     .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
//                     .map((result, index) => (
//                       <div key={index} className="flex justify-between items-center bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-600">
//                         <div className="flex items-center gap-3 sm:gap-4">
//                           <span className="text-gray-300 font-mono w-6 sm:w-8 text-sm sm:text-base">#{index + 1}</span>
//                           <div className="flex items-center gap-2">
//                             <span className="text-gray-100 font-medium text-sm sm:text-base">{result.username}</span>
//                             {index === 0 && (
//                               <span className="bg-yellow-500 text-gray-900 px-1 sm:px-2 py-1 rounded text-xs font-bold">
//                                 WINNER
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-blue-500 font-bold text-sm sm:text-base">{result.wpm || 0} WPM</div>
//                           <div className="text-gray-400 text-xs sm:text-sm">
//                             {result.accuracy || 0}% accuracy
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ModernTypingApp;



































// style chnagessssssssssssssssssss

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "https://typingbackend-b2mf.onrender.com";
const paragraphsData = {
  words: {
    "25": [
      "Reading books improves vocabulary, enhances imagination, and allows people to explore new ideas, cultures, and perspectives from around the world.",
      "Exercise is essential for maintaining both physical and mental health, reducing stress, improving focus, and promoting overall well-being daily.",
      "A good night’s sleep helps restore energy, boosts immunity, and supports brain function, which are crucial for leading a healthy and productive life."
    ],
    "50": [
      "The forest was calm and quiet, except for the occasional rustling of leaves and distant chirping of birds. A soft breeze carried the scent of pine, and the sunlight filtered through the branches, creating dancing shadows on the forest floor. It was a perfect place to unwind and reconnect with nature’s beauty and silence.",
      "Coding is more than just writing instructions for computers; it’s about solving real-world problems and creating efficient, innovative solutions. Learning programming builds logic and creativity, enabling people to turn ideas into reality, automate tasks, and build powerful applications that serve millions around the globe.",
      "Personal growth is a continuous journey that requires self-reflection, resilience, and courage. Facing challenges, learning from failures, and stepping out of comfort zones help individuals evolve, discover their purpose, and unlock their true potential in both personal and professional life."
    ],
    "100": [
      "Technology is rapidly changing the landscape of every industry, from healthcare and education to transportation and entertainment. Artificial intelligence, automation, and machine learning are streamlining tasks and creating new opportunities. At the same time, cybersecurity and ethical use of data have become vital concerns. As we continue to innovate, it's important to stay aware of how these advancements affect our privacy, job markets, and relationships. With the right balance, technology can empower societies and foster inclusivity, accessibility, and sustainability for generations to come. Preparing for a tech-driven future requires education, adaptability, and global cooperation.",
      "The rise and fall of ancient civilizations tell us stories of human resilience, creativity, and conflict. From the towering pyramids of Egypt to the intellectual glory of Greece and the engineering marvels of Rome, history holds lessons about governance, power, culture, and innovation. Trade routes connected distant societies, while wars shaped borders and ideologies. The collapse of these civilizations often came from a mix of internal decay and external threats. By studying the past, we not only honor those who came before us but also learn how to avoid repeating mistakes and build stronger futures.",
      "In the heart of the jungle, where the sun barely touched the forest floor, a hidden tribe thrived for centuries, untouched by modern society. They lived in harmony with nature, using ancient knowledge passed down orally through generations. Their medicine came from plants, their food from the land, and their wisdom from the stars. One day, a young boy ventured too far from the village and discovered a glowing stone buried beneath roots. The elders believed it was a sign of change. That night, the village gathered for a story, unaware that their world was about to transform forever."
    ],
    "150": [
      "Education is the cornerstone of any progressive society. It empowers individuals with knowledge, critical thinking skills, and the confidence to shape their own lives. From the early days of learning the alphabet to advanced fields like quantum physics, education provides the tools needed to understand and improve the world. Modern education systems face challenges like inequality, outdated curricula, and limited access in some regions. However, the rise of online learning platforms and global collaboration among educators has opened up new possibilities. Investing in education, especially for marginalized communities, ensures a more just, innovative, and inclusive world for future generations. The role of teachers, parents, and institutions is essential in fostering curiosity, values, and lifelong learning habits that go far beyond the classroom.",
      "The human mind is a complex and powerful organ capable of extraordinary feats. It processes emotions, stores memories, and makes decisions that define who we are. Neuroscience has made great strides in understanding how the brain works, revealing how experiences and environments shape behavior. Mental health is a crucial aspect of this conversation, as anxiety, depression, and stress affect millions worldwide. Removing stigma around mental illness and promoting psychological wellness is essential. Practices like mindfulness, therapy, and open dialogue have proven effective. In an age of fast living and information overload, prioritizing mental well-being is not just helpful—it’s vital for a balanced life."
    ]
  },

  punctuation: {
    short: [
      "Wait! Did you hear that? Something’s not right. Let’s check it out quickly!",
      "Sure, I’ll be there! Give me five minutes, and I’ll bring your book too."
    ],
    medium: [
      "Hey, listen! I just got a message from her—she’s arriving today. Can you believe it? After all this time, she finally decided to visit. Isn’t that amazing?",
      "No way! You actually met him? That’s incredible. I never thought he would show up at the party. What did he say? Was it awkward or fun?"
    ],
    long: [
      "Alright, so here’s the plan: we’ll leave early in the morning, pack enough snacks and water, and make sure to bring the map. The trail isn’t too difficult, but the weather might get unpredictable in the afternoon. Also, don’t forget to charge your phone and bring your ID, just in case. Sound good?",
      "Well, it’s not that simple, honestly. You see, things have changed a lot since we last talked. People have moved on, jobs have shifted, and not everything is the way it used to be. But that’s okay, right? We adapt, we learn, and we keep moving forward. That’s what matters in the end."
    ]
  }
};


function ModernTypingApp() {
  const [category, setCategory] = useState("words");
  const [subcategory, setSubcategory] = useState("");
  const [selectedWordCount, setSelectedWordCount] = useState("25");
  const [timerDuration, setTimerDuration] = useState(60);

  const [paragraph, setParagraph] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [users, setUsers] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [actualTimeLeft, setActualTimeLeft] = useState(timerDuration + 15);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showingResults, setShowingResults] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  
  // NEW: Win/Lose states
  const [gameResult, setGameResult] = useState(null); // 'won', 'lost', or null
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [sortedResults, setSortedResults] = useState([]);
  
  // Real-time results storage
  const [realtimeResults, setRealtimeResults] = useState({});
  
  // Store test settings
  const [testSettings, setTestSettings] = useState({
    category: "words",
    subcategory: "",
    wordCount: "25",
    duration: 60
  });

  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const usernameRef = useRef("");
  const testStartTimeRef = useRef(null);
  const inputRef = useRef(null);
  const roomCodeRef = useRef("");
  const testDurationRef = useRef(60);

  // NEW: Get real username from localStorage
  const getRealUsername = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      return userData?.username || userData?.name || userData?.email?.split('@')[0] || "Anonymous";
    } catch (error) {
      console.error("Error getting username from localStorage:", error);
      return "Anonymous";
    }
  };

  // NEW: Calculate combined score for ranking
  const calculateCombinedScore = (wpm, accuracy) => {
    // Formula: 70% WPM + 30% Accuracy
    return Math.round((wpm * 0.7) + (accuracy * 0.3));
  };

  // NEW: Process final results and determine winner/loser
  const processGameResults = (results) => {
    if (!results || results.length === 0) return;

    const currentUsername = usernameRef.current;
    
    
    const resultsWithScores = results.map(result => ({
      ...result,
      combinedScore: calculateCombinedScore(result.wpm, result.accuracy)
    }));

    
    const sorted = resultsWithScores.sort((a, b) => b.combinedScore - a.combinedScore);
    setSortedResults(sorted);

    // Find current user's position
    const currentUserIndex = sorted.findIndex(result => result.username === currentUsername);
    const rank = currentUserIndex + 1;
    setCurrentUserRank(rank);

    // Determine if current user won or lost
    if (rank === 1 && sorted.length > 1) {
      setGameResult('won');
    } else if (sorted.length > 1) {
      setGameResult('lost');
    } else {
      setGameResult(null); 
    }

    console.log("Game Results Processed:", {
      currentUser: currentUsername,
      rank: rank,
      totalPlayers: sorted.length,
      result: rank === 1 && sorted.length > 1 ? 'won' : 'lost',
      sortedResults: sorted
    });
  };

  useEffect(() => {
    setTimeLeft(timerDuration);
    setActualTimeLeft(timerDuration + 15);
    testDurationRef.current = timerDuration;
  }, [timerDuration]);

  
  const calculateRealtimeStats = (currentTypedText, currentParagraph, startTime) => {
    if (!currentParagraph || !startTime) {
      return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
    }

    const now = Date.now();
    const elapsedTimeMs = now - startTime;
    const elapsedTimeMinutes = elapsedTimeMs / (1000 * 60);

    const typedChars = currentTypedText.length;
    let correctChars = 0;

    const compareLength = Math.min(typedChars, currentParagraph.length);
    for (let i = 0; i < compareLength; i++) {
      if (currentTypedText[i] === currentParagraph[i]) {
        correctChars++;
      }
    }

    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
    const wpm = elapsedTimeMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeMinutes) : 0;

    return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
  };

  // Calculate final stats at the end of test
  const calculateFinalStats = (currentTypedText, currentParagraph, duration) => {
    if (!currentParagraph) {
      return { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 };
    }

    const typedChars = currentTypedText.length;
    let correctChars = 0;

    const compareLength = Math.min(typedChars, currentParagraph.length);
    for (let i = 0; i < compareLength; i++) {
      if (currentTypedText[i] === currentParagraph[i]) {
        correctChars++;
      }
    }

    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
    const durationMinutes = duration / 60;
    const wpm = durationMinutes > 0 ? Math.round((correctChars / 5) / durationMinutes) : 0;

    return { wpm: Math.max(0, wpm), accuracy, correctChars, totalChars: typedChars };
  };

  useEffect(() => {
    socketRef.current = io(SERVER_URL);

    socketRef.current.on("room-update", (usernames) => {
      setUsers(usernames.map((name, index) => ({ id: index, username: name })));
    });

    socketRef.current.on("start-test", ({ paragraph: receivedParagraph, startTime, duration, settings }) => {
      setParagraph(receivedParagraph);
      setTestStarted(true);
      setTimeLeft(duration);
      setActualTimeLeft(duration + 15);
      setTypedText("");
      setShowingResults(false);
      setFinalResults(null);
      
      // NEW: Reset game result states
      setGameResult(null);
      setCurrentUserRank(null);
      setSortedResults([]);
      
      setWpm(0);
      setAccuracy(100);
      setRealtimeResults({});
      testDurationRef.current = duration;
      
      if (settings) {
        setTestSettings(settings);
      }
      
      // Start 3-second countdown
      setCountdown(3);
      let countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            
            const now = Date.now();
            const delay = Math.max(startTime - now, 0);

            setTimeout(() => {
              setCountdown(0);
              testStartTimeRef.current = Date.now();
              
              intervalRef.current = setInterval(() => {
                const currentTime = Date.now();
                const elapsed = Math.floor((currentTime - testStartTimeRef.current) / 1000);
                const userTimeRemaining = Math.max(duration - elapsed, 0);
                const actualTimeRemaining = Math.max((duration + 15) - elapsed, 0);
                
                setTimeLeft(userTimeRemaining);
                setActualTimeLeft(actualTimeRemaining);

                if (userTimeRemaining <= 0 && !showingResults) {
                  setShowingResults(true);
                  
                  const currentTypedTextRef = inputRef.current?.value || "";
                  const finalStats = calculateFinalStats(currentTypedTextRef, receivedParagraph, duration);
                  
                  console.log("Final stats calculated:", finalStats);
                  
                  setWpm(finalStats.wpm);
                  setAccuracy(finalStats.accuracy);
                  
                  const finalResult = {
                    username: usernameRef.current,
                    wpm: finalStats.wpm,
                    accuracy: finalStats.accuracy,
                    correctChars: finalStats.correctChars,
                    totalChars: finalStats.totalChars,
                    completed: true
                  };
                  
                  console.log("Emitting final result:", finalResult);
                  
                  socketRef.current.emit("submit-result", {
                    roomCode: roomCodeRef.current,
                    username: usernameRef.current,
                    result: finalResult
                  });
                }

                if (actualTimeRemaining <= 0) {
                  clearInterval(intervalRef.current);
                }
              }, 1000);
            }, delay);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socketRef.current.on("realtime-update", (data) => {
      setRealtimeResults(prev => ({
        ...prev,
        [data.username]: data.stats
      }));
    });

    // NEW: Enhanced results processing with win/lose logic
    socketRef.current.on("results", (results) => {
      console.log("Received final results:", results);
      setFinalResults(results);
      
      // Process results to determine winner/loser
      processGameResults(results);
    });

    return () => {
      socketRef.current.disconnect();
      clearInterval(intervalRef.current);
    };
  }, []);

  const getRandomParagraph = () => {
    if (category === "words") {
      const options = paragraphsData.words[selectedWordCount] || [];
      if (options.length === 0) return "No paragraph found for this word count.";
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex];
    } else {
      if (!subcategory) return "Please select a subcategory.";
      const options = paragraphsData[category]?.[subcategory] || [];
      if (options.length === 0) return "No paragraph found for this subcategory.";
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex];
    }
  };

  // UPDATED: Use real username instead of random names
  const handleCreateRoom = () => {
    const realUsername = getRealUsername();
    usernameRef.current = realUsername;
    setIsHost(true);

    const randomPara = getRandomParagraph();
    setParagraph(randomPara);

    const currentSettings = {
      category,
      subcategory,
      wordCount: selectedWordCount,
      duration: timerDuration
    };
    setTestSettings(currentSettings);

    socketRef.current.emit("create-room", { username: realUsername }, ({ roomCode }) => {
      setRoomCode(roomCode);
      roomCodeRef.current = roomCode;
      setJoinedRoom(true);
    });
  };

  // UPDATED: Use real username instead of random names
  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      alert("Please enter a room code.");
      return;
    }

    const realUsername = getRealUsername();
    usernameRef.current = realUsername;
    setIsHost(false);

    socketRef.current.emit("join-room", { username: realUsername, roomCode }, ({ success, error }) => {
      if (!success) {
        alert(error || "Failed to join room.");
        return;
      }
      setRoomCode(roomCode);
      roomCodeRef.current = roomCode;
      setJoinedRoom(true);
    });
  };

  const handleStartTest = () => {
    if (!isHost) return;
    
    const currentSettings = {
      category,
      subcategory,
      wordCount: selectedWordCount,
      duration: timerDuration
    };
    
    socketRef.current.emit("start-test", { 
      roomCode: roomCodeRef.current, 
      paragraph, 
      duration: timerDuration,
      settings: currentSettings 
    });
  };

  const handleTyping = (e) => {
    if (timeLeft === 0 || countdown > 0) return;
    
    const newTypedText = e.target.value;
    setTypedText(newTypedText);
    
    if (testStartTimeRef.current) {
      const stats = calculateRealtimeStats(newTypedText, paragraph, testStartTimeRef.current);
      setWpm(stats.wpm);
      setAccuracy(stats.accuracy);
      
      if (newTypedText.length % 3 === 0 || newTypedText.length === 1) {
        socketRef.current.emit("realtime-stats", {
          roomCode: roomCodeRef.current,
          username: usernameRef.current,
          stats: {
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            progress: Math.min((newTypedText.length / paragraph.length) * 100, 100)
          }
        });
      }
    }
  };

  const subcategoryOptions = {
    punctuation: ["short", "medium", "long"],
    numbers: ["short", "medium", "long"],
    quotes: ["short", "medium", "long"],
  };

  // NEW: Helper functions for components to access game state
  const getGameResultData = () => ({
    gameResult, // 'won', 'lost', or null
    currentUserRank,
    currentUserName: usernameRef.current,
    sortedResults,
    totalPlayers: sortedResults.length,
    showingResults,
    finalResults
  });


const renderTypingArea = () => {
  if (!paragraph) return null;

  return (
    <div className="relative w-full mx-auto">
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] relative overflow-hidden">
        <div className="font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-relaxed md:leading-loose max-w-full mx-auto">
          {(() => {
            const chars = paragraph.split('');
            const segments = [];
            let currentSegment = '';
            let currentClass = '';

            for (let i = 0; i < chars.length; i++) {
              let className = 'text-gray-500';
              
              if (i < typedText.length) {
                className = typedText[i] === chars[i] 
                  ? 'text-gray-200' 
                  : 'text-red-400 bg-red-400/20';
              } else if (i === typedText.length) {
                className = 'text-gray-200 bg-gray-200/20 animate-pulse';
              }

              if (className !== currentClass) {
                if (currentSegment) {
                  segments.push(
                    <span key={segments.length} className={currentClass}>
                      {currentSegment}
                    </span>
                  );
                }
                currentSegment = chars[i];
                currentClass = className;
              } else {
                currentSegment += chars[i];
              }
            }

            if (currentSegment) {
              segments.push(
                <span key={segments.length} className={currentClass}>
                  {currentSegment}
                </span>
              );
            }

            return segments;
          })()}
        </div>
        
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleTyping}
          disabled={timeLeft === 0 || countdown > 0}
          className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none bg-transparent"
          style={{ caretColor: 'transparent' }}
          autoFocus
          spellCheck={false}
        />
      </div>
      
      {/* Countdown overlay */}
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
      
      {/* Results overlay */}
      {showingResults && timeLeft === 0 && countdown === 0 && (
        <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500 mb-2">{wpm}</div>
            <div className="text-sm sm:text-base text-gray-300">Words Per Minute</div>
            <div className="text-xl sm:text-2xl font-bold text-green-500 mt-2">{accuracy}%</div>
            <div className="text-sm sm:text-base text-gray-300">Accuracy</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-4">
              Final results calculating...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



  if (!joinedRoom) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
              TypingTest
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">Modern multiplayer typing test</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4 sm:mb-6">Create Room</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory("");
                      setSelectedWordCount("25");
                    }}
                    className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {Object.keys(paragraphsData).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {category === "words" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
                    <select
                      value={selectedWordCount}
                      onChange={(e) => setSelectedWordCount(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      {Object.keys(paragraphsData.words).map((count) => (
                        <option key={count} value={count}>
                          {count} words
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {category !== "words" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">-- Select --</option>
                      {subcategoryOptions[category]?.map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timer Duration</label>
                  <select
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {[15, 30, 45, 60, 120].map((time) => (
                      <option key={time} value={time}>
                        {time} seconds
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleCreateRoom}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  Create Room
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-4 sm:mb-6">Join Room</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room Code</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full bg-gray-700 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg sm:text-2xl tracking-widest font-mono"
                  />
                </div>

                <button 
                  onClick={handleJoinRoom}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            TypingTest
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="text-gray-400 hidden sm:inline">Room:</span>
            <span className="bg-gray-700 px-2 sm:px-3 py-1 rounded-lg font-mono text-blue-400 border border-gray-700 text-xs sm:text-sm">{roomCode}</span>
            <span className="text-gray-300 hidden sm:inline">{isHost ? 'Host' : 'Guest'}</span>
            {isHost && <span className="text-yellow-500">👑</span>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {!testStarted ? (
          <div className="text-center">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm sm:text-base">Timer: {timerDuration}s</span>
                </div>
                <div className="w-4 h-px sm:w-px sm:h-4 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm sm:text-base">Category: {category}</span>
                </div>
              </div>
            </div>

            {/* Simplified Lobby - Just usernames */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-4">Players in Room</h3>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="bg-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-600">
                      <span className="text-gray-100 font-medium text-sm sm:text-base">{user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isHost && (
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 mb-6 sm:mb-8">
                <h4 className="text-base sm:text-lg font-medium text-gray-100 mb-4">Preview Text</h4>
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700 text-left">
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{paragraph || "No paragraph loaded"}</p>
                </div>
                <button 
                  onClick={handleStartTest}
                  disabled={users.length < 2}
                  className={`mt-4 sm:mt-6 font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base ${
                    users.length < 2 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-700' 
                      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  }`}
                >
                  {users.length < 2 ? 'Waiting for 2 players...' : 'Start Test'}
                </button>
              </div>
            )}

            {!isHost && (
              <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                <p className="text-gray-400 text-sm sm:text-base">Waiting for host to start the test...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Real-time stats display */}
            <div className="text-center">
              <div className="inline-flex items-center gap-4 sm:gap-8 bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-500">{timeLeft}</div>
                  <div className="text-xs sm:text-sm text-gray-400">seconds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-500">{wpm}</div>
                  <div className="text-xs sm:text-sm text-gray-400">wpm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-500">{accuracy}%</div>
                  <div className="text-xs sm:text-sm text-gray-400">accuracy</div>
                </div>
              </div>
            </div>

            {/* Simplified Live leaderboard - Just usernames and stats */}
            {Object.keys(realtimeResults).length > 0 && (
              <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
                <h4 className="text-base sm:text-lg font-bold text-gray-100 mb-3 text-center">Live Rankings</h4>
                <div className="space-y-2">
                  {Object.entries(realtimeResults)
                    .sort((a, b) => b[1].wpm - a[1].wpm)
                    .map(([username, stats], index) => (
                      <div key={username} className="flex justify-between items-center bg-gray-700 p-2 sm:p-3 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-gray-300 font-mono w-4 sm:w-6 text-sm sm:text-base">#{index + 1}</span>
                          <span className="text-gray-100 font-medium text-sm sm:text-base">{username}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-500 font-bold text-sm sm:text-base">{stats.wpm} WPM</div>
                          <div className="text-gray-400 text-xs sm:text-sm">{stats.accuracy}%</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-width typing area - moved outside the container */}
      {testStarted && renderTypingArea()}

      {/* Final results - back in container */}
      {testStarted && (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          {/* Simplified Final results - Just usernames and stats */}
          {finalResults && showingResults && (
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <h4 className="text-lg sm:text-xl font-bold text-gray-100 mb-4 text-center">Final Results</h4>
              <div className="space-y-3">
                {finalResults
                  .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
                  .map((result, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-gray-300 font-mono w-6 sm:w-8 text-sm sm:text-base">#{index + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-100 font-medium text-sm sm:text-base">{result.username}</span>
                          {index === 0 && (
                            <span className="bg-yellow-500 text-gray-900 px-1 sm:px-2 py-1 rounded text-xs font-bold">
                              WINNER
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-500 font-bold text-sm sm:text-base">{result.wpm || 0} WPM</div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {result.accuracy || 0}% accuracy
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
   }
export default ModernTypingApp;