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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    //check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    if (!user.isActive) {
      return next(
        new ErrorResponse("Account is disabled. Contact admin.", 403),
      );
    }

    //check password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    //Update Last Login

    // user.lastLogin = Date.now();
    user.lastLogin = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
