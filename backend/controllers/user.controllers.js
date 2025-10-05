import User from "../models/user.model.js";
// import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

// ✅ Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // middleware sets this

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get Current User Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Update Assistant (Name + Image)
export const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId; // set by your auth middleware
    const { assistantName, imageUrl } = req.body;

    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    let assistantImage;

    // If file uploaded → send to Cloudinary
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else if (imageUrl) {
      assistantImage = imageUrl;
    }

    // Update user document
    const user = await User.findByIdAndUpdate(
      userId,
      {
        assistantName,assistantImage
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Assistant updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update Assistant Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update assistant",
      error: error.message,
    });
  }
};







export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;

    // get AI result
    const result = await geminiResponse(command, assistantName, userName);

    // extract JSON from model response
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand." });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;
    const userInput = gemResult.userinput;
    const responseText = gemResult.response;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput,
          response: `The time is ${moment().format("HH:mm:ss")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput,
          response: `This month is ${moment().format("MMMM")}`,
        });

     

      default:
        return res.json({
          type,
          userInput,
          response: responseText || "I'm still learning to handle this request.",
        });

        
    }
  } catch (error) {
    console.error("Assistant error:", error);
    return res.status(500).json({ response: "Something went wrong." });
  }
};
