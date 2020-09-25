const router = require("express").Router();
const { userAuth, checkRole } = require("../utils/Auth");
const {
  helperCreate,
  helperGetByName,
} = require("../controller/helperController");

router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    console.log(`Helper create start`);
    await helperCreate(req.body, res);
  }
);

router.get(
  "/by-name",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`get helper by name`);
    return helperGetByName(req.query,res);
  }
);

module.exports = router;
