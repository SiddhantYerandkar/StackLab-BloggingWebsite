// Import necessary modules
const express = require('express')
const mongoose = require('mongoose');
const route = require('./routes/route');
const errorMiddleware = require('./middleware/errorMiddleware');

//Create an instance of the Express application
const app = express()
const PORT = 3000

//Middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    next();
});

// Middleware to parse JSON in the request body
app.use(express.json())

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => console.log("MongoDb Connected"))
    .catch((error) => console.log(error))

//Use the defined routes
app.use('/', route)

//Error handling middleware to catch and handle errors
app.use(errorMiddleware)

//Handles requests for undefined routes
app.use((req, res) => {
    res.status(404).send({
        status: false, message: `Page Not Found , Given URL ${req.url} is incorrect for this application`
    })
})

//Start the server and listen to specified port
app.listen(PORT, () => console.log(`Connected to ${PORT}`))