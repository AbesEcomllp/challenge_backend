import express from "express";
import { registerUser, LoginUser, registerAdmin,GetAllUsers, LogoutUser,verifyPaymentandRegister} from "../controllers/user.controllers.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuthenticated from "../middlewares/auth.js";
isAuthenticated
const router = express.Router();
// user routes
router.route("/register").post(registerUser);
router.route("/webhook/payment-status").post(verifyPaymentandRegister);
router.route("/admin/login").post(LoginUser);
router.route("/admin/register").post(registerAdmin);

router.route("/admin/logout").post(isAuthenticated, LogoutUser);
router.route("/admin/all").get(isAuthenticated, isAdmin, GetAllUsers);















export default router;
