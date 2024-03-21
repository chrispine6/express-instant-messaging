// server.js
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./middleware/auth.middleware');
const io = socketIO(server);

// Load environment variables from environment file
dotenv.config();

// create express app
const app = express();

// import all routes
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const chatRoutes = require('./routes/chat.routes'); // Add chat routes

// app.use
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// set up user session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

// connect to mongo
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// set view engine
app.set('view engine', 'ejs');

// initialise passport
app.use(passport.initialize());
app.use(passport.session());

// route imports
app.use('/', authRoutes);
app.use('/home', homeRoutes);
app.use('/chat', chatRoutes);

// start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// real time integration
io.on('connection', socket => {
    console.log('new client connected');
    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

// include logic for handeling "chat message" event from client in chat routes file
chatRoutes(io); 