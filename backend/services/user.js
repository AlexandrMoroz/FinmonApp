const { serializeUser } = require("../utils/auth");
const bcrypt = require("bcryptjs");
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
      role: body.role,
      username: body.username,
      password: password,
    }).save();
    return serializeUser(createdUser);
  }
  async edit(user) {
    if (user.password) user.password = await bcrypt.hash(user.password, 12);

    let editedUser = await User.findOneAndUpdate(
      { _id: user.id },
      {
        ...user,
      },
      { new: true }
    );
    return serializeUser(editedUser);
  }
  async getAll() {
    let tempUsers = await User.find();
    return tempUsers.map((item) => {
      return serializeUser(item);
    });
  }

  async deleteAll() {
    await User.deleteMany({});
  }
}
module.exports = new UserService();
