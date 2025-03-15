const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'users.json');

const app = express();

// const users = [];
const users = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
let uniqueID = 0;
users.forEach(element => {
    uniqueID = element.id;
});


const userSchema = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.number().min(0).max(150).required(),
    city: joi.string().min(1)
})
app.use(express.json());

app.get('/users', (req, res) => {
    res.send({ users });
})

app.get('/users/:id', (req, res) => {
    const userId = +req.params.id;

    const user = users.find(user => user.id === userId);
    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.post('/users', (req, res) => {
    uniqueID += 1;
    users.push({
        id: uniqueID,
        ...req.body
    });
    fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));

    res.send({ id: uniqueID });
});

app.put('/users/:id', (req, res) => {
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }
    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);
    if (user) {
        const { firstName, secondName, age, city } = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.age = age;
        user.city = city;
        fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {
    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);
    if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.listen(3000);