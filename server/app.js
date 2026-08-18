require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dcsFormRoutes = require("./routes/dcs-form");
const crankRoutes = require("./routes/crankRoute");

const cors = require("cors");
const app = express();
const changePoint = require("./routes/changepoint");
const { error } = require("./middleware/error");
const oracleRouter = require("./routes/oracleDDRoutes");
const bodyParser = require("body-parser");
const postgresqlRoutes = require('./routes/postgresqlDBR');
const pool = require('./connections/postgresDB');


mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT);
    console.log(
      `Succesfully Connected To DCS DB at Port : ${process.env.PORT}`
    );
  })
  .catch((err) => console.log(err));

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); //
app.use(bodyParser.json()); // Parse JSON data

app.use("/dcs", dcsFormRoutes);
app.use("/changePoint", changePoint);
app.use("/oracle", oracleRouter);
app.use("/crank",crankRoutes);
app.use('/api', postgresqlRoutes);




app.use(error);
