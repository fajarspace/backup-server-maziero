const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const UserModel = require("./UserModel.js");

const { DataTypes } = Sequelize;
const GaleriModel = db.define(
  "galeri",
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
      type: DataTypes.STRING,
    },
    gambar: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
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

UserModel.hasMany(GaleriModel);
GaleriModel.belongsTo(UserModel, { foreignKey: "userId" });

module.exports = GaleriModel;
