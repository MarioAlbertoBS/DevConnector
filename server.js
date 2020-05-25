//Set express server
const express = require('express');
const app = express();

const connectDb = require('./config/db');

//Connect db
connectDb();

//Home route
app.get("/", (req, res) => res.send('API running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Define port from env file or local if doesn't exists
const PORT = process.env.PORT || 5000;

//Listen port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});