const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());

//connect database
connectDB();

//Init MiddleWare
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || "5000";

app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
