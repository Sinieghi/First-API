const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "provide the company name"],
      maxlength: 25,
    },
    position: {
      type: String,
      required: [true, "provide the position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobsSchema);
