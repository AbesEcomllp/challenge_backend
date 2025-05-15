import express from "express";
import { registerUser, verifyPaymentandRegister} from "../controllers/user.controllers.js";
const router = express.Router();
// user routes
router.route("/register").post(registerUser);
router.route("/webhook/payment-status").post(verifyPaymentandRegister);














export default router;
