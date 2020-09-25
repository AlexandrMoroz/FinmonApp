const router = require("express").Router();
// Bring in the User Registration function
const { userAuth, checkRole } = require("../utils/Auth");
const {
  userCreater,
  userEditer,
  userLogin,
  getUsers,
} = require("../controller/userController");
// Users Registeration Route
router.post(
  "/create-user",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    console.log(`user create start ${(req.body.username, req.body.password)}`);
    await userCreater(req.body, res);
  }
);
// Users Registeration Route
router.post("/edit-user", userAuth, checkRole(["admin"]), async (req, res) => {
  console.log(`user edit start`);
  await userEditer(req.body, res);
});

// Users Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});

// Get all users
router.get("/allusers", userAuth, checkRole(["admin"]), async (req, res) => {
  console.log(`get all users`);
  return getUsers(res);
});

module.exports = router;
