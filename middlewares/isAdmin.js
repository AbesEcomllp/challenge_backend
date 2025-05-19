import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.utils.js"
import User from "../Models/User.model.js"
export const isAdmin = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            message: "Please login first!"
        });
    }

    try {
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user in the database
        req.user = await User.findById(decoded._id);

        if (!req.user || req.user.role !== "admin") {
            return res.status(404).json({ message: "User not found or is not admin." });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid token or session expired" });
    }
});
export default isAdmin;