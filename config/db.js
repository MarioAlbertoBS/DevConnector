const mongoose = require('mongoose');
const config = require('config');

require('dotenv').config();

const host = process.env.DATABASE_HOST;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const dbUri = `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`;
console.log(dbUri);

//Stablish db connection as a promise
const connectDB = async () => {
    try {
      //Wait until connection
      await mongoose.connect(dbUri, {
          //Set connection options for Atlas (default usage is deprecated)
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      console.log("Database connected...");
    } catch (err) {
      console.error("Database Conection Failed: " + err.message);
      //End process with failure
      process.exit(1);
    }
}

//Export the const
module.exports = connectDB;