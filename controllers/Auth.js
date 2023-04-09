const UserModel = require("../models/UserModel.js");
const argon2 = require("argon2");

const Login = async function (req, res) {
  const user = await UserModel.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Password salah! 😠" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const nama = user.nama;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ uuid, nama, email, role });
};

const Profile = async function (req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  console.log(req.session.userId);
  const user = await UserModel.findOne({
    attributes: ["uuid", "nama", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

const logOut = function (req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};

module.exports = {
  Login,
  Profile,
  logOut,
};
