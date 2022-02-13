const { serializeUser } = require("../utils/auth");

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
  
    
}
module.exports = new UserService();
