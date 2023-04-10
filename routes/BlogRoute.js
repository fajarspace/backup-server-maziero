const express = require("express");
const {
  getAllBlog,
  getBlogByJudulUrl,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/BlogController.js");
const { verifyUser } = require("../middleware/AuthUser.js");

const router = express.Router();

// CREATE - POST
router.post("/blogs", verifyUser, createBlog);

// SORTIR / SEARCH
// router.get("/blogs", searchBlog);

// READ - GET without Auth
router.get("/blogs", getAllBlog);

// READ - GET by id
router.get("/blogs/:id", getBlogById);

// READ - GET by id
router.get("/blog/:judulUrl", getBlogByJudulUrl);

// UPDATE - PATCH
router.patch("/blogs/:id", verifyUser, updateBlog);

// DELETE
router.delete("/blogs/:id", verifyUser, deleteBlog);

module.exports = router;
