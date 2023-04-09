const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const UserModel = require("./UserModel.js");

const { DataTypes } = Sequelize;
const BlogModel = db.define(
  "blogs",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    konten: {
      type: DataTypes.TEXT,
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

UserModel.hasMany(BlogModel);
BlogModel.belongsTo(UserModel, { foreignKey: "userId" });

module.exports = BlogModel;
