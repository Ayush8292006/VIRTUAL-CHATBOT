import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

function Card({ image }) {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  return (
    <div
      className={`w-[80px] h-[160px] lg:w-[150px] h-[250px] bg-[#030326] border-2 border-[#0000ff89] rounded-2xl overflow-hidden 
        hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
        ${selectedImage === image ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} alt="Assistant Option" className="h-full w-full object-cover" />
    </div>
  );
}

export default Card;
