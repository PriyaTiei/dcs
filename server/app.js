require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dcsFormRoutes = require("./routes/dcs-form");
const cors = require("cors");
const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT);
    console.log(`Succesfully Connected To DCS DB at Port : ${process.env.PORT}`);
  })
  .catch((err) => console.log(err));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/dcs", dcsFormRoutes);
