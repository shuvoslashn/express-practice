const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 6000;
const uri = process.env.MONGODB_URI;

//* MongoDB Connection
mongoose
    .connect(uri, { useNewUrlParser: true })
    .then(() => console.log(`Connected!`))
    .catch(() => console.log(`Not connected`));

mongoose.connection.on(`connected`, () => {
    console.log(`Mongoose default connection open`);
});
mongoose.connection.on(`error`, (err) => {
    console.log(`Mongoose default connection error`);
});

//* Mongoose Schema
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    age: Number,
});

//* Mongoose Model
const User = mongoose.model('User', userSchema);

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
    const user = getUserById(req);
    // if user not found, user will undifined
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: `user not found` });
    }
});

//? API to update single user
app.put('/users/:id', (req, res) => {
    const user = getUserById(req);
    const body = req.body;
    // if user not found, user will undifined
    if (user) {
        user.fname = body.fname;
        user.lname = body.lname;
        res.json(user);
    } else {
        res.status(404).json({ message: `user not found` });
    }
});

//? API to delete an user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = users.findIndex((u) => u.id === Number(id));
    if (userIndex === -1) {
        res.status(404).json({ message: `user not found` });
    } else {
        users.splice(userIndex, 1);
        res.json({ message: `${userIndex + 1} no. user deleted` });
    }
});

//? API to check connection
app.get('/', (req, res) => {
    res.json({ message: `Welcome to our app` });
});

// Server listening
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

const getUserById = (req) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);
    return user;
};
