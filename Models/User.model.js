import mongoose, { Schema } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name!"],
    },
    email: {
      type: String,
      unique: true,
      validate: validator.isEmail,
      required: [true, "Please enter email!"],
    },
    phone: {
      type: String,
      required: [true, "Please enter phone number!"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number! It should have exactly 10 digits.`,
      },
    },
    address: {
      type: String,
      required: [true, "Please enter Address!"],
    },
    pincode: {
      type: Number,
      min: 100000,
      max: 999999,
      required: [true, "Please enter Pin Code!"],
    },
    city: {
      type: String,
      required: [true, "Please enter City!"],
    },
    state: {
      type: String,
      required: [true, "Please enter State!"],
    },
    order_id: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String, // Added to store transaction ID from webhook
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "challenger", timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;