const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

function guid() {
    const x = 'xxxyy'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(8);
    })
    return parseInt(x);
}

const dataBase = [
    { title: "The Intelligent Investor", rating: 4.1, id: guid() },
    { title: "Harry Potter and the Philosopher's Stone", rating: 4.9, id: guid()},
    { title: "Shantaram", rating: 4.5, id: guid() },
];

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.get('/books', (req, res) => {
    res.send(dataBase);
});

app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = dataBase.find(x => x.id === id);
    if (book) {
        res.send(book);
    } else {
        res.send('Not Found');
    }
});

app.post('/books', function (req, res) {
    const newBook = {
        title: req.body.title,
        rating: req.body.rating,
        id: guid()
    }
    dataBase.push(newBook);
    res.send(newBook);
});


app.put('/books/:id', function (req, res) {
    const id = parseInt(req.params.id);
    let index = dataBase.findIndex(x => x.id === id);
    if (index >= 0) {
        const { title, rating } = req.body;
        dataBase[index] = {
            ...dataBase[index],
            title,
            rating
        };
        res.send(dataBase);
    } else {
        res.status(400).send({ error: "Book not found" });
    }

});

app.delete('/books', function (req, res) {
    res.send('DELETE request to the All Books');
    dataBase = [];
    res.send(dataBase);
});

app.delete('/books/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const currentIndex = dataBase.findIndex(x => x.id === id);
    dataBase.splice(currentIndex, 1);
    console.log(dataBase.length);
    res.send(dataBase);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    };

    console.log(`server is listening on ${port}`);
});
