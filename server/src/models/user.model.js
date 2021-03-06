const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { subscribe } = require("../controllers/payment");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    mobile:   { type: String, required: true },
    password: { type: String, required: true },
    role :    {type: String, default:"subscriber"},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();


  var hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  return next();
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", userSchema); // user => users

module.exports = User;
