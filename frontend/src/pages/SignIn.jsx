import React, { useContext, useState } from "react";
import bg from "../assets/img.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false)
  const [password, setPassword] = useState("");
  const { serverUrl , userData, setUserData} = useContext(userDataContext);

  const [error, setError] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data)
      setLoading(false)
      // Navigate to dashboard after signin
      navigate("/");
    } catch (err) {
      console.error(err);
      setLoading(false)
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center relative flex"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Full-screen overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Right side form */}
      <div className="relative w-full flex justify-end items-center px-6 md:px-16 z-20">
        <form
          className="w-[95%] max-w-[500px] h-[700px] bg-[#0000004e] backdrop-blur-lg shadow-2xl shadow-black rounded-3xl flex flex-col items-center justify-center gap-6 p-10 relative"
          onSubmit={handleSignin}
        >
          {/* Title */}
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 text-center">
            Sign In to <span className="text-blue-400">Virtual Assistant</span>
          </h1>

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-full bg-white/10 border border-white text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          {/* Password input with toggle */}
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-4 rounded-full bg-white/10 border border-white text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-14"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Error message */}
          {error.length > 0 && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          {/* Sign In Button */}
          <button className="w-full min-w-[150px] h-[60px] mt-6 text-white font-bold text-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300" disabled={loading}>
            {loading?"Loading...":"Sign Up"}
          </button>

          {/* Extra text with navigate */}
          <p className="text-white text-[19px] mt-4 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
