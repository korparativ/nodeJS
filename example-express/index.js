const express = require('express');
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'count.json');
const count = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

const server = express();

server.get('/', (req, res) => {
    count.count++;
    fs.writeFileSync(pathToFile, JSON.stringify(count, null, 2));
    res.send(`<h1>Добро пожаловать!!!</h1><a href="/about">About</a><p>Переходов: ${ count.count }</p>`);

});

server.get('/about', (req, res) => {
    count.count1++;
    fs.writeFileSync(pathToFile, JSON.stringify(count, null, 2));
    res.send(`<h1>About!!!</h1><a href="/">Home</a><p>Переходов: ${count.count1}</p>`);
});

server.listen(3000);