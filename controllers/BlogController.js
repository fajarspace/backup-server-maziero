const { Op } = require("sequelize");
const BlogModel = require("../models/BlogModel.js");
const UserModel = require("../models/UserModel.js");
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");

const createBlog = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const { judul, konten } = req.body;
  const sanitizedKonten = sanitizeHtml(konten, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "img",
      "figure",
      "figcaption",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "class"],
      figure: ["class"],
      figcaption: ["class"],
    },
  });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await BlogModel.create({
        judul: judul,
        konten: sanitizedKonten,
        gambar: fileName,
        url: url,
        userId: req.userId,
      });
      res.status(201).json({ msg: "Blog Created Successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

const getAllBlog = async (req, res) => {
  try {
    const response = await BlogModel.findAll({
      attributes: ["uuid", "gambar", "judul", "konten", "url", "createdAt"],
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

const searchBlog = async (req, res, next) => {
  const searchTerm = req.query.q;
  try {
    const posts = await BlogModel.findAll({
      where: {
        [Op.or]: [
          { judul: { [Op.substring]: searchTerm } },
          { konten: { [Op.substring]: searchTerm } },
        ],
      },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

const getBlogByJudul = async (req, res) => {
  try {
    const response = await BlogModel.findOne({
      attributes: ["uuid", "judul", "konten", "gambar", "url", "createdAt"],
      where: {
        judul: req.params.id,
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

const getBlogById = async (req, res) => {
  try {
    const response = await BlogModel.findOne({
      attributes: ["uuid", "judul", "konten", "gambar", "url", "createdAt"],
      where: {
        // judul: req.params.judul,
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

const updateBlog = async (req, res) => {
  const blog = await BlogModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!blog) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = blog.gambar;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${blog.gambar}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const { judul, konten } = req.body;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await BlogModel.update(
      { judul: judul, konten: konten, gambar: fileName, url: url },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Blog Updated Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const deleteBlog = async (req, res) => {
  const blog = await BlogModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!blog) return res.status(404).json({ msg: "No Data Found" });
  try {
    // const filepath = `./public/images/${blog.gambar}`;
    // fs.unlinkSync(filepath);
    if (req.role === "admin") {
      await BlogModel.destroy({
        where: {
          uuid: req.params.id,
        },
      });
    } else {
      if (req.userId !== blog.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await BlogModel.destroy({
        where: {
          [Op.and]: [{ id: params.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Blog Deleted Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllBlog,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlog,
  getBlogByJudul,
};
