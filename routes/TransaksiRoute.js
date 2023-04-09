const express = require("express");
const {
  getTransaksi,
  getTransaksiById,
  addTransaksi,
  updateTransaksi,
  deleteTransaksi,
  getSaldo,
} = require("../controllers/TransaksiController.js");
const { verifyUser } = require("../middleware/AuthUser.js");

const router = express.Router();

router.get("/transaksi", getTransaksi);
router.get("/transaksi/:id", verifyUser, getTransaksiById);
router.post("/transaksi", verifyUser, addTransaksi);
router.patch("/transaksi/:id", verifyUser, updateTransaksi);
router.delete("/transaksi/:id", verifyUser, deleteTransaksi);
router.get("/saldo", getSaldo);

module.exports = router;
