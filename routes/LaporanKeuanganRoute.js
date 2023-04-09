const express = require("express");
const {
  getLaporanKeuangan,
  getLaporanKeuanganById,
  createLaporanKeuangan,
  updateLaporanKeuangan,
  deleteLaporanKeuangan,
} = require("../controllers/LaporanKeuanganController.js");
const { verifyUser } = require("../middleware/AuthUser.js");

const router = express.Router();

// CREATE - POST
router.post("/laporan", verifyUser, createLaporanKeuangan);

// READ - GET without Auth
router.get("/laporan", getLaporanKeuangan);

// READ - GET by id
router.get("/laporan/:id", verifyUser, getLaporanKeuanganById);

// UPDATE - PATCH
router.patch("/laporan/:id", verifyUser, updateLaporanKeuangan);

// DELETE
router.delete("/laporan/:id", verifyUser, deleteLaporanKeuangan);

module.exports = router;
