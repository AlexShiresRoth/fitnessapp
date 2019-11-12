const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log("mongodb connected homie");
  } catch (error) {
    console.log(error.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
