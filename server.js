//Set express server
const express = require("express");
const app = express();

const path = require("path");

const connectDb = require("./config/db");

require('dotenv').config();

//Connect db
connectDb();

//Init middleware
app.use(express.json({ extended: false }));

//Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
    //Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

//Define port from env file or local if doesn't exists
const PORT = process.env.PORT || 5000;

//Listen port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
