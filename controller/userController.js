const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { SECRET } = require("../config");
const { serializeUser } = require("../utils/Auth");

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userCreater = async (userDets, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false,
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const newUser = new User({
      block: false,
      name: userDets.name,
      family: userDets.family,
      surname: userDets.surname,
      cashboxAdress: userDets.cashboxAdress,
      email: userDets.email,
      role: "user",
      username: userDets.username,
      password,
    });

    await newUser.save();
    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login.",
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC To edit the user
 */
const userEditer = async (userDets, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsernameOnEdit(userDets);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false,
      });
    }

    if (userDets.password) {
      userDets.password = await bcrypt.hash(userDets.password, 12);
    }

    // Find user and edit it
    let editedUser = await User.findOneAndUpdate(
      { _id: userDets._id },
      userDets,
      (err, doc, res) => {
        if (err) {
          console.log("error on editing ");
          throw err;
        }
      }
    );

    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login.",
      user: serializeUser(editedUser),
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to edit your account.",
      success: false,
      error: err,
    });
  }
};
/**
 * @DESC To get all users
 */
const getUsers = async (res) => {
  let tempUsers = await User.find();
  tempUsers = tempUsers.map((item) => serializeUser(item));
  return res.status(201).json({
    message: "User get succcesed",
    users: tempUsers,
    success: true,
  });
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, res) => {
  let { username, password } = userCreds;
  // First Check if the username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials.",
      success: false,
    });
  }
  const isBlock = await User.findOne({ username });
  if (isBlock.block) {
    return res.status(403).json({
      message: "You are being block by admin",
      success: false,
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      SECRET,
      { expiresIn: "8h" }
    );

    let result = {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 28800,
    };
    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true,
    });
  } else {
    return res.status(403).json({
      message: "Wrong login or password.",
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateUsernameOnEdit = async (user) => {
  let findUsers = await User.find({ username: user.username });

  if (findUsers.length > 1) {
    return false;
  }
  if (findUsers.length == 1) {
    console.log(findUsers);
    console.log(user);
    return findUsers[0]._id.toString() === user._id ? true : false;
  }
  return true;
};

module.exports = {
  getUsers,
  userLogin,
  userCreater,
  userEditer,
};
