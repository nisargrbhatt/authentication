const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  gender: {
    type: String,
  },
  contact_no: {
    type: Number,
  },
  address: {
    type: String,
  },
  profile_setup: {
    type: Boolean,
    default: false,
  },
  last_login: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
