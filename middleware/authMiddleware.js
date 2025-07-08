import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
      }
    const user = await User.find({ _id: decoded._id }).select('-password');      
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User Not Found" });
      }
    req.user = user;
      next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server side Error" });
  }
};

export default verifyUser;