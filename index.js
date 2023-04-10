const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");
const FileUpload = require("express-fileupload");

const db = require("./config/Database.js");
// const UserModel = require("./models/UserModel");
// const BlogModel = require("./models/BlogModel");
// const LaporanKeuanganModel = require("./models/LaporanKeuanganModel");
// const GaleriModel = require("./models/GaleriModel.js");
// const TransaksiModel = require("./models/TransaksiModel");
const AuthRoute = require("./routes/AuthRoute");
const UserRoute = require("./routes/UserRoute");
const BlogRoute = require("./routes/BlogRoute");
const GaleriRoute = require("./routes/GaleriRoute");
const TransaksiRoute = require("./routes/TransaksiRoute");

dotenv.config();
const app = express();

// (async () => {
//   await db.sync();
// })();

// try {
//   await db.authenticate();
//   console.log("Database Connected...");
//   await GaleriModel.sync();
// } catch (error) {
//   console.error(error);
// }

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});
app.set("trust me!", 1);
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
    name: "Maziero_Cookie", // This needs to be unique per-host.
    cookie: {
      secure: "auto", // required for cookies to work on AUTO
      httpOnly: false,
      sameSite: "none",
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "https://maziero681.com",
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

// Route
app.get("/", (req, res) => {
  res.status(201).json({
    messages: "Sukses konek!!",
  });
});

app.use(AuthRoute);
app.use(UserRoute);
app.use(BlogRoute);
app.use(GaleriRoute);
app.use(TransaksiRoute);

// store.sync(); // add field session

app.listen(process.env.PORT, () =>
  console.log(`Server berjalan di port '${process.env.PORT}'`)
);
