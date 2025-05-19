import User from "../Models/User.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import errorHandler from "../middlewares/errorHandler.js";
import crypto from "crypto";
import { paymentHandler } from "../utils/payments.cjs";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, pincode, address, city, state, entryFee } = req.body;
  console.log(req.body);

  if (!name || !email || !phone || !pincode || !address || !city || !state || !entryFee) {
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
    return res.status(400).json({ success: false, message: "Order could not be placed." });
  }

  try {
    user = await User.create({
      name,
      email,
      phone,
      pincode,
      address,
      city,
      state,
      order_id,
      paymentStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      sessionId: payResponse.payment_session_id,
      message: "SessionId sent successfully",
      order_id: payResponse.order_id,
    });
  } catch (error) {
    console.error("User creation error:", error);
    return res.status(400).json({ success: false, message: `User could not be created: ${error.message}` });
  }
});

export const verifyPaymentandRegister = asyncHandler(async (req, res, next) => {
  try {
    // Verify webhook signature
    // const secret = process.env.CASHFREE_WEBHOOK_SECRET;
    // const receivedSignature = req.headers["x-webhook-signature"];

    // if (!receivedSignature) {
    //   return res.status(401).json({ success: false, message: "Missing webhook signature" });
    // }

    // const rawBody = JSON.stringify(req.body);
    // const computedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");

    // if (computedSignature !== receivedSignature) {
    //   return res.status(401).json({ success: false, message: "Invalid webhook signature" });
    // }

    // Extract payment details (Cashfree webhook payload)
    const { order_id, order_status, transaction_id } = req.body.data.order; // Adjust based on Cashfree payload

    if (!order_id || !order_status) {
      return res.status(400).json({ success: false, message: "Invalid webhook data" });
    }

    // Find user by order_id
    const user = await User.findOne({ order_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update payment status
    if (order_status === "PAID") {
      user.paymentStatus = "Success";
      user.transactionId = transaction_id;
    } else if (order_status === "FAILED" || order_status === "USER_DROPPED") {
      user.paymentStatus = "Failed";
    } else {
      user.paymentStatus = "Pending";
    }

    await user.save();

    return res.status(200).json({ success: true, message: "Payment status updated" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});