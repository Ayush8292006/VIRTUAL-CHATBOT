import React, { useContext, useRef } from "react";
import Card from "../components/Card";
import { FaImage } from "react-icons/fa";

import image1 from "../assets/img1.png";
import image2 from "../assets/img2.png";
import image3 from "../assets/img3.png";
import image4 from "../assets/img4.png";
import image5 from "../assets/img5.png";
import image6 from "../assets/img6.png";
import image7 from "../assets/img7.png";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function Customize() {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file); // file to send to backend
    setFrontendImage(URL.createObjectURL(file)); // preview
    setSelectedImage(null); // clear card selection
  };

  // Handle card selection
  const handleCardSelect = (imgUrl) => {
    setSelectedImage(imgUrl); // selected card URL
    setFrontendImage(null);
    setBackendImage(null); // clear uploaded file
  };

  return (
  <div className="w-full h-[100vh] bg-gradient-to-br from-[#030353] via-[#000000] to-[#060630] flex flex-col justify-center items-center px-4 overflow-auto">
    {/* Page Title */}
    <h1 className="text-white text-[36px] md:text-[42px] font-bold text-center p-[20px] mb-[40px] animate-fade-in-down drop-shadow-lg">
      Select Your <span className="text-blue-400">Assistant Image</span>
    </h1>

    {/* Image selection grid */}
    <div className="w-full max-w-[1000px] flex flex-wrap justify-center items-center gap-[30px]">
      {[image1, image2, image3, image4, image5, image6, image7].map((img, index) => (
        <div
          key={index}
          onClick={() => handleCardSelect(img)}
          className={`w-[180px] h-[260px] rounded-2xl overflow-hidden cursor-pointer
            bg-gradient-to-tr from-[#0a0a2a] via-[#0c0c3f] to-[#0a0a50] 
            shadow-2xl shadow-blue-800 transition-transform duration-500 ease-in-out
            transform hover:scale-110 hover:rotate-1 hover:shadow-blue-500 
            hover:shadow-2xl animate-float relative border-2 ${
              selectedImage === img ? "border-blue-400 border-4" : "border-transparent"
            }`}
        >
          <img
            src={img}
            alt={`assistant-${index}`}
            className="w-full h-full object-cover rounded-2xl"
          />
          {/* Neon glow effect */}
          {selectedImage === img && (
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse"></div>
          )}
        </div>
      ))}

 

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputImage}
        hidden
        onChange={handleImageUpload}
      />
    </div>

    {/* Next Button */}
    {(selectedImage || backendImage) && (
      <button
        className="mt-[50px] px-14 py-4 text-lg font-bold text-white rounded-full 
          bg-gradient-to-r from-blue-500 to-indigo-700 shadow-lg hover:shadow-2xl 
          hover:from-indigo-600 hover:to-blue-700 transition-all duration-500 ease-in-out
          transform hover:scale-110 animate-bounce"
        onClick={() => navigate("/customize2")}
      >
        Next →
      </button>
    )}
  </div>
);


}

export default Customize;
