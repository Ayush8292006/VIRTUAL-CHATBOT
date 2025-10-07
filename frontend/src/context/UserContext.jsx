import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "https://virtual-chatbot-backend-07wj.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get current logged-in user
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      setUserData(result.data);
    } catch (error) {
      console.log("Error fetching current user:", error.message);
    }
  };

  // Get Gemini AI response safely
  const getGeminiResponse = async (command) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      let data = response.data;

      if (typeof data === "string") {
        data = { type: "general", userInput: command, response: data };
      }

      return {
        type: data.type || "general",
        userInput: data.userInput || command,
        response: data.response || "",
      };
    } catch (error) {
      console.error("Error while fetching Gemini Response:", error);

      return {
        type: "general",
        userInput: command,
        response: error.response?.data?.response || "Something went wrong. Try again.",
      };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider
      value={{
        serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
