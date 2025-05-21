import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AdminSchema = new Schema(
  {
   
    email: {
      type: String,
      unique: true,
      validate: validator.isEmail,
      required: [true, "Please enter email!"],
    },
    password: {
      type: String,
      required: [true, "Please enter password!"],
      select: false,
    },
     role:{
        type:String,
        enum:["admin", "user"],
        default: "admin",
        required: true,
    },
  },
  { collection: "Main", timestamps: true }
);
AdminSchema.pre("save", async function(next) {
    if(!this.isModified("password")){return next()}
    const hashed = await bcrypt.hash(this.password,10)
    this.password = hashed;
    next();


})


AdminSchema.methods.getJWTToken= function(){
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET,{
        expiresIn: "15d",
    })
}
AdminSchema.methods.comparePassword= function(password){
   return bcrypt.compare(password, this.password)
}
const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
