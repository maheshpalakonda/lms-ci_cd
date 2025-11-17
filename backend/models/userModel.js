import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },

    // ✅ For Active/Inactive tracking
    lastLogin: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Check if user is inactive (60 days = 2 months)
userSchema.methods.checkInactive = function () {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
  if (this.lastLogin < twoMonthsAgo) {
    this.status = "inactive";
  } else {
    this.status = "active";
  }
  return this.status;
};

const User = mongoose.model("User", userSchema);
export default User;