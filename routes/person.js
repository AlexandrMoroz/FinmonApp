const router = require("express").Router();
const { userAuth, checkRole } = require("../utils/Auth");
const {
  getPersons,
  getPersonFormDataById,
  personCreate,
  personEdit,
  searchPersons
} = require("../controller/personsController");
router.post(
  "/create",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`person create start`);
    await personCreate(req.body, res);
  }
);

router.post(
  "/edit",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`person edit start`);
    await personEdit(req.body, res);
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
    console.log(`get all persons`);
    return getPersons(res);
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
    console.log(`get person by id`);
    return getPersonFormDataById(req.query,res);
  }
);
/**
 * @DECS search form person 
 */
router.get(
  "/search",
  userAuth,
  checkRole(["user", "admin"]),
  async (req, res) => {
    console.log(`search for persons`);
    return searchPersons(req.query,res);
  }
);
module.exports = router;
