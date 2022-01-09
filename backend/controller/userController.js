const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { devConfig } = require("../config");
const { serializeUser } = require("../utils/Auth");


/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const Create = async (body, res, next) => {
  try {
    // Get the hashed password
    const password = await bcrypt.hash(body.password, 12);
    // create a new user
    let createdUser = await new User({
      block: false,
      name: body.name,
      family: body.family,
      surname: body.surname ? body.surname : "",
      cashboxAdress: body.cashboxAdress ? body.cashboxAdress : "",
      email: body.email ? body.email : "",
      role: "user",
      username: body.username,
      password: password,
    }).save();

    res.status(201).json({
      message: "User was created",
      result: serializeUser(createdUser),
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to create account.", error: err });
  }
};

/**
 * @DESC To edit the user
 */
const Edit = async (body, res, next) => {
  try {
    // Find user and edit it
    let editedUser = await User.findOneAndUpdate(
      { _id: body.id },
      { ...body },
      (err, doc, res, next) => {
        if (err) {
          throw err;
        }
      }
    );
    res.status(200).json({
      message: "User success edited",
      result: serializeUser(editedUser),
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to edit account.", error: err });
  }
};
/**
 * @DESC To get all users
 */
const All = async (res, next) => {
  try {
    let tempUsers = await User.find();
    tempUsers = tempUsers.map((item) => {
      return serializeUser(item);
    });
    res.status(200).json({
      message: "User get all was succces",
      result: tempUsers,
      success: true,
    });
  } catch (error) {
    next({ message: "Unable get accounts.", error: err });
  }
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const Login = async (body, res, next) => {
  try {
    let { username } = body;
    let user = await User.findOne({ username });
    // First Check if the username is in the database
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      devConfig.SECRET,
      { expiresIn: "8h" }
    );

    let result = {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: `Bearer ${token}`,
      expiresIn: 28800,
    };
    res.status(200).json({
      message: "You are now logged in.",
      ...result,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable login.", error: err });
  }
};

module.exports = {
  All,
  Login,
  Create,
  Edit,
};
