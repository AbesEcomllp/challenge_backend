import express from "express"
import cors from "cors"
import {config} from "dotenv"
import users from "./routes/user.routes.js";
import orders from "./routes/order.routes.js";
import  errorHandler  from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express();
export default app;
config()
const corsOptions = {
    origin: ["http://localhost:5173", "https://himalixir.com"], // Allowed origins
    methods: ['GET', 'POST', 'PUT'], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-webhook-signature"],
 // Allowed headers
    credentials: true // Allow cookies/auth headers
};


app.use(cors(corsOptions));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(errorHandler)
app.use("/api/user", users)
app.use("/api/order", orders)
app.get("/", (req,res)=>{
    res.send("api runnning")
})


