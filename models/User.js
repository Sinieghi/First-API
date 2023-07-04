const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "provide name"],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "provide email"],
    // isso aqui é para o email, caso o email ja esteja cadastrado
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "provide passwor"],
    minlength: 6,
  },
});
//aqui acontece a aplicação do hash password que basicamente gera um password aleatorio para o user quando ele cadastra, ja q n pode enviar a senha com o valor digtado pelo user
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
//presta atenção nesse processo de comparação, pois o password la do auth controller login esta sendo enviado por ele ao invocar comparePassword()
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
