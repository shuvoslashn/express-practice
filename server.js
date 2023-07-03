const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 6000;
const uri = process.env.MONGODB_URI;

//* MongoDB Connection
mongoose
    .connect(uri, { useNewUrlParser: true })
    .then(() => console.log(`Database Connected!`))
    .catch(() => console.log(`Database Not connected`));

mongoose.connection.on(`connected`, () => {
    console.log(`Mongoose default connection open.`);
});
mongoose.connection.on(`error`, (err) => {
    console.log(`Mongoose default connection error.`);
});

//* Mongoose Schema
const userSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: String,
        age: Number,
        password: String,
    },
    {
        // mongoose flag
        timestamps: true,
    }
);

//* Mongoose Model
const User = mongoose.model('User', userSchema);

// middlewares
app.use(bodyParser.json());

//? API to create a user
app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const userObj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            age: req.body.age,
            password: hashedPassword,
        };
        const user = new User(userObj);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `create user error` });
    }
});

//? API to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `all users data fatching error`,
        });
    }
});

//? API to get only one user
app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: `user not found` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `user data fatching error` });
    }
});

//? API to update single user
app.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const user = await User.findByIdAndUpdate(id, body, { new: true });
        if (user) {
            user.fname = body.fname;
            user.lname = body.lname;
            res.json(user);
        } else {
            res.status(404).json({ message: `user not found` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `user data updating error` });
    }
});

//? API to delete an user
app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: `user not found` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `user data deleting error` });
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
