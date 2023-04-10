const express = require("express");
const {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
} = require("../controllers/GaleriController.js");
const { verifyUser } = require("../middleware/AuthUser.js");

const router = express.Router();

// CREATE - POST
router.post("/galeri", verifyUser, createGaleri);

// SORTIR / SEARCH
// router.get("/galeri", searchGaleri);

// READ - GET without Auth
router.get("/galeri", getAllGaleri);

// READ - GET by id
router.get("/galeri/:id", getGaleriById);

// UPDATE - PATCH
router.patch("/galeri/:id", verifyUser, updateGaleri);

// DELETE
router.delete("/galeri/:id", verifyUser, deleteGaleri);

module.exports = router;
