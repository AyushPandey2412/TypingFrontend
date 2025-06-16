// import React from "react";
// import TypingTest from "./TypingTest";

// const App = () => {
//   return (
//     <div className="app">
//       <TypingTest />
//     </div>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TypingTest from "./TypingTest";
import Signup from "./Signup"; // Add your Signup component
import Login from "./Login";   // (Optional) Add this if you create Login component
import MultiplayerPage from "./MultiplayerPage";
// import Home from "./Home";   // (Optional) Create this if you want a landing page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TypingTest />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Multiplayer" element={<MultiplayerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
