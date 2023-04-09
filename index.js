const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const FileUpload = require("express-fileupload");

const db = require("./config/Database");
// const UserModel = require("./models/UserModel");
// const BlogModel = require("./models/BlogModel");
// const LaporanKeuanganModel = require("./models/LaporanKeuanganModel");
// const GaleriModel = require("./models/GaleriModel");
// const TransaksiModel = require("./models/TransaksiModel");
const AuthRoute = require("./routes/AuthRoute");
const UserRoute = require("./routes/UserRoute");
const BlogRoute = require("./routes/BlogRoute");
const GaleriRoute = require("./routes/GaleriRoute");
const TransaksiRoute = require("./routes/TransaksiRoute");

dotenv.config();
const app = express();

// const sessionStore = SequelizeStore(session.Store);
// const store = new sessionStore({
//   db: db,
// });
app.set("trust me!", 1);
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: db,
    }),
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
    origin: process.env.ORIGIN,
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

// Route
app.get("/", (req, res) => {
  res.json({
    message: "Sukses konek!!",
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
