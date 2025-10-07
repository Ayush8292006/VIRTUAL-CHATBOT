import React, { useContext } from "react";
import image1 from "../assets/img1.png";
import image2 from "../assets/img2.png";
import image3 from "../assets/img3.png";
import image4 from "../assets/img4.png";
import image5 from "../assets/img5.png";
import image6 from "../assets/img6.png";
import image7 from "../assets/img7.png";
import { userDataContext } from "../context/UserContext";
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

  // Handle card selection
  const handleCardSelect = (imgUrl) => {
    setSelectedImage(imgUrl);
    setFrontendImage(null);
    setBackendImage(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#030353] via-[#000000] to-[#060630] flex flex-col justify-center items-center px-4 py-10 overflow-auto">
      {/* Page Title */}
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 drop-shadow-lg">
        Select Your <span className="text-blue-400">Assistant Image</span>
      </h1>

      {/* Image selection grid */}
      <div className="w-full max-w-[1100px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center">
        {[image1, image2, image3, image4, image5, image6, image7].map(
          (img, index) => (
            <div
              key={index}
              onClick={() => handleCardSelect(img)}
              className={`w-[140px] h-[200px] sm:w-[160px] sm:h-[230px] md:w-[180px] md:h-[260px]
                rounded-2xl overflow-hidden cursor-pointer
                bg-gradient-to-tr from-[#0a0a2a] via-[#0c0c3f] to-[#0a0a50]
                shadow-xl shadow-blue-900 transition-all duration-500 ease-in-out
                transform hover:scale-110 hover:rotate-1 hover:shadow-blue-600 relative border-2
                ${
                  selectedImage === img
                    ? "border-blue-400 border-4 shadow-blue-500"
                    : "border-transparent"
                }`}
            >
              <img
                src={img}
                alt={`assistant-${index}`}
                className="w-full h-full object-cover rounded-2xl"
              />
              {selectedImage === img && (
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse"></div>
              )}
            </div>
          )
        )}
      </div>

      {/* Next Button */}
      {(selectedImage || backendImage) && (
        <button
          className="mt-12 px-12 py-4 text-lg font-bold text-white rounded-full 
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
