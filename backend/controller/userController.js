const UserService = require("../services/user");

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
    let result = await UserService.login(body);
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
