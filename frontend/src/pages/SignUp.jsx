import React, { useContext, useState } from "react";
import bg from "../assets/img.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      navigate("/customize");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center relative flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Background Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Glassmorphic Centered Form */}
      <form
        onSubmit={handleSignup}
        className="relative z-20 w-[95%] max-w-[500px] bg-black/10 backdrop-blur-2xl 
        border border-blue-400/40 rounded-3xl shadow-[0_0_35px_rgba(59,130,246,0.6)] 
        p-8 md:p-10 flex flex-col items-center gap-6 text-white"
      >
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-4 rounded-full bg-white/10 border border-blue-300 text-white text-lg placeholder-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-full bg-white/10 border border-blue-300 text-white text-lg placeholder-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* Password */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 rounded-full bg-white/10 border border-blue-300 text-white text-lg placeholder-gray-300 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-14"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-blue-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Button */}
        <button
          className="w-full h-[55px] mt-4 text-white font-semibold text-lg rounded-full 
          bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_0_25px_rgba(59,130,246,0.7)] 
          hover:shadow-[0_0_35px_rgba(59,130,246,1)] hover:scale-[1.02]
          transition-all duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {/* Redirect to Sign In */}
        <p className="text-white text-[17px] mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
