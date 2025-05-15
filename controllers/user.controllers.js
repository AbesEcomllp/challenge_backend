import User from "../Models/User.model.js"
import  asyncHandler  from "../utils/asyncHandler.utils.js"
import { sendToken } from "../utils/sendToken.utils.js";


export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email,phone, password, pincode, address, city, state } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
        return next(new Error("Please provide name, email, and password"));
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
        return next(new Error("User already exists"));
    }

    // Function to generate referral code
    const generateRandomCode = (length) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        return Array.from({ length }, () => 
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join("");
    };

    const referralCode = generateRandomCode(6);

    // Create new user
   
    try {
         user = await User.create({
        name, email, password, phone, referralCode, pincode, address, city, state
    });
        sendToken(res, user, "User registered successfully", 201);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }

    // Send authentication token
    sendToken(res, user, "User registered successfully", 201);
});

export const LoginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate request fields
    if (!email || !password) {
        return next(new Error("Please provide email and password"));
    }

    // Find user and include password in the selection
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new Error("User does not exist"));
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new Error("Invalid credentials"));
    }

    // Send authentication token
    sendToken(res, user, "Welcome back user", 201);
});
export const LogoutUser = asyncHandler(async (req, res, next) => {
    res.status(200)
        .cookie("token", "", {
            expires: new Date(0), // Ensures the cookie is removed effectively
            httpOnly: true,       // Improves security by restricting client-side access
            secure: process.env.NODE_ENV === "production", // Enforces HTTPS in production
            sameSite: true,    // Prevents CSRF attacks
        })
        .json({
            message: "User logged out successfully",
            success: true
        });
});



export const GetUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200)
    .json({
        user,
        success: true,
    })
    })
    
    
    