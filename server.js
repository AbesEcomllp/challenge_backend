import app from "./index.js"
import ConnectDB from "./Config/Db.js";
await ConnectDB();
app.listen(process.env.PORT, ()=>{
    console.log(`server started at port ${process.env.PORT}`)
})