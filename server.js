//Set express server
const express = require('express');
const app = express();

//Home route
app.get("/", (req, res) => res.send('API running'));

//Define port from env file or local if doesn't exists
const PORT = process.env.PORT || 5000;

//Listen port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});