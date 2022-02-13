const UserService = require("../services/user");
const bcrypt = require("bcryptjs");
const { devConfig } = require("../config/index");
const jwt = require("jsonwebtoken");

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const Create = async (body, res, next) => {
  try {
    // create a new user
    let createdUser = await UserService.create(body);

    res.status(201).json({
      message: "User was created",
      result: createdUser,
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
    let editedUser = await UserService.edit(body);
    // Find user and edit it
    res.status(200).json({
      message: "User success edited",
      result: editedUser,
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
    let users = await UserService.getAll();
    res.status(200).json({
      message: "User get all was succces",
      result: users,
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
    let user = await UserService.getUserByUsername(username);
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
