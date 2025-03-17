const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const { errorHandler, notFoundHandler } = require('@/utils/errorHandler'); // Updated


const MiddlewiresUser = () => { 

    // Middlewares
app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);
}

module.exports = {MiddlewiresUser}