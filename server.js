const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 6000;

// local database
const users = [];
let lastId = 0;

// middlewares
app.use(bodyParser.json());

//? API to create a user
app.post('/users', (req, res) => {
    const user = req.body;
    user.id = ++lastId;
    users.push(user);
    res.status(201).json(user);
});

//? API to get all users
app.get('/users', (req, res) => {
    res.json(users);
});

//? API to get only one user
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(id, 1);
    res.send(user);
});

//? API to check connection
app.get('/', (req, res) => {
    res.json({ message: `Welcome to our app` });
});

// Server listening
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
