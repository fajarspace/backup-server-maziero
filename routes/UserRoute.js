const express = require("express");
const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController.js");
const { verifyUser, adminOnly } = require("../middleware/AuthUser.js");

const router = express.Router();

// CREATE - POST
router.post("/users", createUser);

// READ - GET
router.get("/users", verifyUser, adminOnly, getUser);

// READ - GET by id
router.get("/users/:id", verifyUser, adminOnly, getUserById);

// UPDATE - PATCH
router.patch("/users/:id", verifyUser, adminOnly, updateUser);

// DELETE
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);

module.exports = router;

// const { getUsers, Register, Login, Logout } = require("../controllers/UserController.js");
// const { verifyToken } = require("../middleware/VerifyToken.js");
// const { refreshToken } = require("../controllers/RefreshToken.js");

// const router = express.Router();

// router.get('/users', verifyToken, getUsers);
// router.post('/users', Register);
// router.post('/login', Login);
// router.get('/token', refreshToken);
// router.delete('/logout', Logout);

// module.exports = router;
