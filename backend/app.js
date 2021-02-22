const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
const userRoutes = require("./routes/user");

const app = express();

/*=============================================
=                   Database Connect                   =
=============================================*/

mongoose
  .connect("mongodb://127.0.0.1:27017/authentication", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection Failed.");
  });
/*============  End of Database Connect  =============*/

/*=============================================
=                   Helmet                   =
=============================================*/

app.use(helmet());

/*============  End of Helmet  =============*/

/*=============================================
=                   Body Parser                   =
=============================================*/

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/*============  End of Body Parser  =============*/

/*=============================================
=                   Logger                   =
=============================================*/

app.use(morgan("dev"));

/*============  End of Logger  =============*/

/*=============================================
=                   Statics                   =
=============================================*/

app.use("/images", express.static(path.join("images")));

/*============  End of Statics  =============*/

/*=============================================
=                   CORS                   =
=============================================*/

app.use(cors());

/*============  End of CORS  =============*/

/*=============================================
=                   Routes                   =
=============================================*/

app.use("/user", userRoutes);

/*============  End of Routes  =============*/

/*=============================================
=                   Response                   =
=============================================*/

app.use((resObj, req, res, next) => {
  return res.status(resObj.status).json(resObj.response);
});

/*============  End of Response  =============*/

/*=============================================
=                   Tests                   =
=============================================*/

console.log(`Server running on localhost:3000`);
app.use("/", (req, res, next) => {
  res.send(`<h1>Hello from Server!!!</h1>`);
});

/*============  End of Tests  =============*/

module.exports = app;
