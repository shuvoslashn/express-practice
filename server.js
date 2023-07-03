const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

//? API to create a user (Registration)
app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const userObj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            age: req.body.age,
            password: password,
        };
        const user = new User(userObj);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Registration Failed` });
    }
});

//? API to login users
app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).json({ message: `This email is not registered` });
        } else {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!isValidPassword) {
                res.status(401).json({ message: `Wrong Password` });
            } else {
                const token = jwt.sign(
                    { email: user.email, id: user.id },
                    process.env.JWT_SECRET
                );
                const userObj = user.toJSON();
                userObj['accessToken'] = token;

                res.status(200).json(userObj);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Login Failed` });
    }
});

//* Middleware to authenticate JWT access tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' });
                console.log(err);
            } else {
                req.user = user;
                next();
            }
        });
    }
};

//* User profile api
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const id = req.user.id;
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
app.get('/users/:id', authenticateToken, async (req, res) => {
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
