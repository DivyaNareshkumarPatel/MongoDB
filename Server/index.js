require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ["", "http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.static(path.join(__dirname, '..', 'Client', 'Pages')));
app.use('/style', express.static(path.join(__dirname, '..', 'Client', 'Style')));
app.use('/script', express.static(path.join(__dirname, '..', 'Client', 'Script')));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my MongoDB project!');
});
app.use('/users', userRoutes);

// MongoDB Connection
const mongoURI = process.env.DATABASE;
mongoose.connect(mongoURI, {
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
