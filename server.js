const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 6000;

// local database
const users = [];

// middlewares
app.use(bodyParser.json());

//? API to create a user
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).json(user);
});

//? API to check connection
app.get('/', (req, res) => {
    res.json({ message: `Welcome to our app` });
});

// Server listening
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
