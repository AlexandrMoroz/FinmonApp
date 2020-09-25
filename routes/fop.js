const router = require("express").Router();
const { userAuth, checkRole } = require("../utils/Auth");
const {
  getFOPs,
  getFOPFormDataById,
  FOPCreate,
  FOPEdit,
} = require("../controller/fopController");
router.post(
  "/create",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`FOP create start`);
    await FOPCreate(req.body, res);
  }
);

router.post(
  "/edit",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`FOP edit start`);
    await FOPEdit(req.body, res);
  }
);

/**
 * @DECS get all persons in name, family, surname, INN format
 */
router.get(
  "/all",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`get all FOPs`);
    return getFOPs(res);
  }
);
/**
 * @DECS get person form object by id of object 
 */
router.get(
  "/form-data",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`get FOP form data by id`);
    return getFOPFormDataById(req.query,res);
  }
);
module.exports = router;
