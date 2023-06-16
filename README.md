# express-practice

## mongoose connection
```bash
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
```
<br>


## mongoose schema
```bash
const userSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: String,
        age: Number,
    },
    {
        // mongoose flag
        timestamps: true,
    }
);
```
<br>


## API to create a user
```bash
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `create user error` });
    }
});
```
<br>


## API to get all users
```bash
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
```

## API to get only one user
```bash
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
```

## API to update single user
```bash
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
```

## API to delete an user
```bash
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
```

## API to check connection
```bash
app.get('/', (req, res) => {
    res.json({ message: `Welcome to our app` });
});
```

