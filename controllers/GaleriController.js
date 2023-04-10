const { Op } = require("sequelize");
const GaleriModel = require("../models/GaleriModel.js");
const UserModel = require("../models/UserModel.js");
const path = require("path");
const fs = require("fs");

const createGaleri = (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No File Uploaded" });
  }
  const { deskripsi } = req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/galeri/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: "Invalid Images" });
  }
  if (fileSize > 10000000) {
    return res.status(422).json({ msg: "Image must be less than 10 MB" });
  }

  file.mv(`./public/galeri/${fileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    try {
      await GaleriModel.create({
        deskripsi: deskripsi,
        gambar: fileName,
        url: url,
        userId: req.userId,
      });
      res.status(201).json({ msg: "Galeri Created Successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

const getAllGaleri = async (req, res) => {
  try {
    const response = await GaleriModel.findAll({
      attributes: ["uuid", "gambar", "deskripsi", "url"],
      include: [
        {
          model: UserModel,
          attributes: ["nama", "email"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getGaleriById = async (req, res) => {
  try {
    const response = await GaleriModel.findOne({
      attributes: ["uuid", "gambar", "deskripsi", "url"],
      where: {
        uuid: req.params.id,
      },
      include: [
        {
          model: UserModel,
          attributes: ["nama", "email"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateGaleri = async function (req, res) {
  const galeri = await GaleriModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!galeri) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = galeri.gambar;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 10000000)
      return res.status(422).json({ msg: "Image must be less than 10 MB" });

    const filepath = `./public/galeri/${galeri.gambar}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/galeri/${fileName}`, function (err) {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const { date, deskripsi } = req.body;
  const url = `${req.protocol}://${req.get("host")}/galeri/${fileName}`;

  try {
    await GaleriModel.update(
      { date: date, deskripsi: deskripsi, gambar: fileName, url: url },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Galeri Updated Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteGaleri = async function (req, res) {
  const galeri = await GaleriModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!galeri) return res.status(404).json({ msg: "Data tidak ditemukan" });

  try {
    const filepath = `./public/galeri/${galeri.gambar}`;
    fs.unlinkSync(filepath);
    if (req.role === "admin") {
      await GaleriModel.destroy({
        where: {
          uuid: req.params.id,
        },
      });
    } else {
      if (req.userId !== jadwal.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await GaleriModel.destroy({
        where: {
          [Op.and]: [{ id: params.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Galeri Deleted Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllGaleri,
  createGaleri,
  getGaleriById,
  updateGaleri,
  deleteGaleri,
};
