const express = require("express");
const validateToken = require("../middleware/validateToken");
const { getAdminReport, getUserReport } = require("../controller/report.Controller");

const router = express.Router();

router.post("/get-admin-reports", validateToken, getAdminReport);
router.get("/get-user-reports", validateToken, getUserReport);
module.exports = router;
