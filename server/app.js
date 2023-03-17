const express = require("express");
const mongoose = require("mongoose");
const dcsFormRoutes = require("./routes/dcs-form");
const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/dcs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5001);
    console.log("Succesfully Connected To DCS DB");
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/dcs", dcsFormRoutes);
