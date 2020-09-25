const router = require("express").Router();
const { userAuth, checkRole } = require("../utils/Auth");
const {
  formCreate,
  formEdit,
  formGetAll,
  formGetByName,
} = require("../controller/formController");

router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    console.log(`form create start`);
    await formCreate(req.body, res);
  }
);

router.post(
  "/edit",
  userAuth,
  checkRole([ "admin"]),
  async (req, res) => {
    console.log(`form edit start`);
    await formEdit(req.body, res);
  }
);

router.get(
  "/all",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`get all forms`);
    return formGetAll(res);
  }
);

router.get(
  "/by-name",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`get form by name`);
    return formGetByName(req.query,res);
  }
);

module.exports = router;
