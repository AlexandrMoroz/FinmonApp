const router = require("express").Router();
const { userAuth, checkRole } = require("../utils/Auth");
const {
  PersonHistoryGetById,
  PersonXMLSHistoryGetById,
  FopHistoryGetById,
} = require("../controller/historyController");

router.get(
  "/person-history",
  //userAuth,
  //checkRole(["admin"]),
  async (req, res) => {
    console.log(`get person history`);
    return PersonHistoryGetById(req.query, res);
  }
);

router.get(
  "/person-history-file",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    console.log(`get person history`);
    return PersonXMLSHistoryGetById(req.query, res);
  }
);

router.get(
    "/fop-history",
    userAuth,
    checkRole(["admin"]),
    async (req, res) => {
        console.log(`get fop history`);
        return FopHistoryGetById(req.query, res);
    }
);

module.exports = router;
