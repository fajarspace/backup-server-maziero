"use strict";

const { Op } = require("sequelize");
const UserModel = require("../models/UserModel.js");
const TransaksiModel = require("../models/TransaksiModel.js");

const getTransaksi = async (req, res) => {
  try {
    const response = await TransaksiModel.findAll({
      attributes: ["uuid", "deskripsi", "jumlah", "tipe", "date"],
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

const getTransaksiById = async (req, res) => {
  try {
    const response = await TransaksiModel.findOne({
      attributes: ["uuid", "deskripsi", "jumlah", "tipe", "date"],
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

const addTransaksi = async (req, res) => {
  const { deskripsi, jumlah, tipe, date } = req.body;
  try {
    const transaction = await TransaksiModel.create({
      deskripsi,
      jumlah,
      tipe,
      date,
      userId: req.userId,
    });
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const updateTransaksi = async (req, res) => {
  try {
    const transaksi = await TransaksiModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!transaksi)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { deskripsi, jumlah, tipe, date } = req.body;
    await TransaksiModel.update(
      {
        deskripsi,
        jumlah,
        tipe,
        date,
      },
      {
        where: {
          id: transaksi.id,
        },
      }
    );
    res.status(200).json({ msg: "Update transaksi berhasil!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await TransaksiModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!transaksi)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { deskripsi, jumlah, tipe, date } = req.body;
    if (req.role === "admin") {
      await TransaksiModel.destroy({
        where: {
          id: transaksi.id,
        },
      });
    } else {
      if (req.userId !== transaksi.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await TransaksiModel.destroy({
        where: {
          [Op.and]: [{ id: transaksi.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Hapus transaksi berhasil!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getSaldo = async (req, res) => {
  try {
    const transaksi = await TransaksiModel.findAll();
    let pemasukan = 0;
    let pengeluaran = 0;

    transaksi.forEach((transaction) => {
      if (transaction.tipe === "pemasukan") {
        pemasukan += transaction.jumlah;
      } else {
        pengeluaran += transaction.jumlah;
      }
    });

    const balance = pemasukan - pengeluaran;

    res.json({ pemasukan, pengeluaran, balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getTransaksi,
  getTransaksiById,
  deleteTransaksi,
  getSaldo,
  addTransaksi,
  updateTransaksi,
};
