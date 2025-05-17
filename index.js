import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import users from "./routes/user.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://himalixir.com"];
const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-webhook-signature"],
    credentials: true,
};

// Apply CORS
app.use(cors(corsOptions));


// Handle favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/user", users);
app.get("/", (req, res) => {
    res.send("API running");
});

// Error Handler (last middleware)
app.use(errorHandler);

export default app;
