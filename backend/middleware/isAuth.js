import jwt from "jsonwebtoken"; // assuming you are using JWT

export const isAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    // Verify token (replace 'your_jwt_secret' with your secret key)
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request if needed
    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};


export default isAuth;