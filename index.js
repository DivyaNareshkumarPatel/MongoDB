require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({}));
app.use(express.static(path.join(__dirname, 'Client', 'Pages')));
app.use('/style', express.static(path.join(__dirname, 'Client', 'Style')));
app.use('/script', express.static(path.join(__dirname, 'Client', 'Script')));
app.get('/', (req, res) => {
    res.send(__dirname,'Client','Pages','index.html');
});
app.use('/users', userRoutes);
const mongoURI = process.env.DATABASE;
mongoose.connect(mongoURI, {
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
