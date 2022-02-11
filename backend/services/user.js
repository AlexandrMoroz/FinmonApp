const { serializeUser } = require("../utils/auth");
const bcrypt = require("bcryptjs");
const { devConfig } = require("../config/index");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
class UserService {
  constructor() {
    if (UserService._instance) {
      return UserService._instance;
    }
    UserService._instance = this;
  }
  async getUserByUsername(username) {
    return await User.findOne({ username: username });
  }
  async create(body) {
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
    return serializeUser(createdUser);
  }
  async edit(body) {
    let editedUser = await User.findOneAndUpdate({ _id: body.id }, { ...body });
    return serializeUser(editedUser);
  }
  async getAll() {
    let tempUsers = await User.find();
    return tempUsers.map((item) => {
      return serializeUser(item);
    });
  }
  async login(body) {
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

    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: `Bearer ${token}`,
      expiresIn: 28800,
    };
  }
}
module.exports = new UserService();
