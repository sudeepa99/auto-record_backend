const User = require("../models/user");

//Register User
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      role: "member",
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
