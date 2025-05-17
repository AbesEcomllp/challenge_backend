import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import users from "./routes/user.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ✅ Improved CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173", "https://himalixir.com"], // ✅ Remove wildcard `*`
    methods: ["GET", "POST", "PUT", "OPTIONS"], // ✅ Explicitly defined methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-webhook-signature"],
    credentials: true, // ✅ Required for authentication headers
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, x-webhook-signature");
    res.status(200).end();
});

// ✅ Parse incoming JSON requests
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Log incoming requests for debugging
app.use((req, res, next) => {
    console.log("Incoming request headers:", req.headers);
    next();
});

// ✅ Routes
app.use("/api/user", users);
app.get("/", (req, res) => {
    res.send("API is running");
});

// ✅ Error handling middleware
app.use(errorHandler);

export default app;
