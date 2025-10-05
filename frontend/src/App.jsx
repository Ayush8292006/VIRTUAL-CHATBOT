import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/customize";
import { userDataContext } from "./context/userContext";
import Home from "./pages/Home";
import Customize2 from "./pages/customize2";

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      {/* Home route - requires assistant setup */}
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />

      {/* Signup route - redirect to home if logged in */}
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <home/> :<Navigate to ={"/customize"}/>}/>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      {/* Signin route - redirect to home if logged in */}
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      {/* Customize route - only if user is signed in, else redirect to signin */}
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signup" />}
      />

       <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signup" />}
      />

      {/* Optional: Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
