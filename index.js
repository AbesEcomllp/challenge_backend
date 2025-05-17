import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import users from "./routes/user.routes.js";
import  errorHandler  from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();



const corsOptions = {
    origin: ["http://localhost:5173", "https://himalixir.com"], // Explicitly set allowed origins
    methods: ["GET", "POST", "PUT", "OPTIONS"], // Correctly define allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-webhook-signature"],
    credentials: true, // Allow cookies/auth headers
};

// Apply CORS
app.use(cors(corsOptions));

// Explicitly set headers for all responses
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, x-webhook-signature");
    next();
});

// Handle preflight (OPTIONS) requests separately
app.options("*", (req, res) => {
    res.status(200).end();
});

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(errorHandler)
app.use("/api/user", users)
app.get("/", (req,res)=>{
    res.send("api runnning")
})
export default app;

