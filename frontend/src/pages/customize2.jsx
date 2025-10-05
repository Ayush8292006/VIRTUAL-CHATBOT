import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon

function Customize2() {
  const { userData, setUserData, backendImage, selectedImage, serverUrl } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const navigate = useNavigate();

  // Update assistant handler
  const handleUpdateAssistant = async () => {
    if (!assistantName.trim()) return;

    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        // File upload
        formData.append("assistantImage", backendImage);
      } else if (selectedImage) {
        // Predefined image URL
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update context
      setUserData(result.data.data);

      // Navigate to home
      navigate("/home");
    } catch (error) {
      console.error(
        "Update Assistant Error:",
        error.response?.data || error.message
      );
      alert("Failed to update assistant. Check console for details.");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-[#030353] via-[#000000] to-[#060630] flex justify-center items-center flex-col relative">
      
      {/* Back button */}
      <button
        className="absolute top-5 left-5 flex items-center gap-2 text-white text-lg font-semibold hover:text-blue-400 transition"
        onClick={() => navigate("/customize")}
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-white text-[36px] md:text-[42px] font-bold text-center p-[20px] mb-[40px]">
        Enter your <span className="text-blue-400">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="Your Assistant's Name"
        className="w-[90%] max-w-[400px] p-4 rounded-full bg-white/10 border border-white text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-8"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      {assistantName.trim() && (
        <button
          className="mt-[20px] px-12 py-4 text-lg font-bold text-white rounded-full 
          bg-gradient-to-r from-blue-500 to-indigo-700 shadow-lg hover:shadow-2xl 
          hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
          onClick={handleUpdateAssistant}
        >
          Finally create your assistant →
        </button>
      )}
    </div>
  );
}

export default Customize2;
