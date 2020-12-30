import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    emailToken: {
      type: String,
    },

    emailTokenExpiry: {
      type: Number,
      select: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Number,
      select: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },

    address: { type: String },

    phone: { type: String },

    linkedIn: { type: String },

    image: { type: String },

    slicedPhone: { type: String },

    completed: { type: String, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
