const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const UserModel = require("./UserModel.js");

const { DataTypes } = Sequelize;
const TransaksiModel = db.define(
  "transaksi",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deskripsi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jumlah: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tipe: {
      type: Sequelize.ENUM("pemasukan", "pengeluaran"),
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

UserModel.hasMany(TransaksiModel);
TransaksiModel.belongsTo(UserModel, { foreignKey: "userId" });

module.exports = TransaksiModel;
