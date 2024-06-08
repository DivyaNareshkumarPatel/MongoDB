.config;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'Client', 'Pages')));
app.use('/style', express.static(path.join(__dirname, '..', 'Client', 'Style')));
app.use('/script', express.static(path.join(__dirname, '..', 'Client', 'Script')));
app.get('/', (req, res) => {
    res.send('Welcome to my MongoDB project!');
});
app.use('/users', userRoutes);
console.log(process.env.DATABASE)
const mongoURI = "mongodb+srv://divyamyindia271:divya%40271@cluster0.qnamq3u.mongodb.net/mongoDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, {
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
app.listen(PORT, () => {