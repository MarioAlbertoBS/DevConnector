const mongoose = require('mongoose');
const config = require('config');

//Get value from default.json with config package
const db = config.get('mongoURI');

//Stablish db connection as a promise
const connectDB = async () => {
    try {
      //Wait until connection
      await mongoose.connect(db, {
          //Set connection options for Atlas (default usage is deprecated)
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      console.log("Database connected...");
    } catch (err) {
      console.error(err.message);
      //End process with failure
      process.exit(1);
    }
}

//Export the const
module.exports = connectDB;