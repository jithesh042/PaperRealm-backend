import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next(); // ✅ only call next() if we have a valid user
    }

    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
