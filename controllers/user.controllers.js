import User from "../Models/User.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import errorHandler from "../middlewares/errorHandler.js";
import crypto from "crypto";
import {paymentHandler} from "../utils/payments.cjs";



export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, pincode, address, city, state, entryFee } = req.body;
  console.log(req.body)
  if (!name || !email) {
    return next(errorHandler({ message: "Please enter all required fields", statusCode: 400 }));
  }

  let user = await User.findOne({ email });
  if (user && user.paymentStatus === "Success") {
    return next(errorHandler({ message: "User already exists", statusCode: 400 }));
  }

  const generateRandomCode = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
  };
  
  const order_id = generateRandomCode(10);
  
  const payResponse = await paymentHandler(entryFee, order_id, email.split("@")[0], phone);

  if (!payResponse.payment_session_id) {
    return res.status(201).json({ success: false, message: "Order could not be placed." });
  }
  // Create user and set paymentStatus as "Pending"
  try {
    user = await User.create({
      name,
      email,
      phone,
      pincode,
      address,
      city,
      state,
      order_id
    });
console.log(payResponse.payment_session_id)

    res.status(201).json({
      success: true,
      sessionId: payResponse.payment_session_id,
      message: "SessionId sent successfully",
      order_id: payResponse.order_id,
    });
  } catch (error) {
    return res.status(201).json({ success: false, message: `user could not be created because (${error})` });
  }
});
export const verifyPaymentandRegister = asyncHandler(async(req, res, next)=>{

// Webhook endpoint
  try {
    // Verify the webhook signature
    const secret = process.env.WEBHOOK_SECRET; // Get this from Cashfree dashboard
    const receivedSignature = req.headers["x-webhook-signature"];
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (receivedSignature !== generatedSignature) {
      return res.status(403).json({ success: false, message: "Invalid signature" });
    }

    const { orderId, status } = req.body; // Extract payment details

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Find the user linked to this order
    const user = await User.findOne({ order_id: orderId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update payment status
    if (status === "PAYMENT_SUCCESS") {
      user.paymentStatus = "Success";
    } else if (status === "PAYMENT_FAILED") {
      user.paymentStatus = "Failed";
    }

    await user.save();

    res.status(200).json({ success: true, message: "Payment status updated" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
