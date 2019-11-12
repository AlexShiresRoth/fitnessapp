const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("mongodb connected homie");
  } catch (error) {
    console.log("what the fuck");
    console.log(error.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
