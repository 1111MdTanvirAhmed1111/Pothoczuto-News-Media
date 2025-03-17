require('module-alias/register');
require('dotenv').config();


const {StartServer  } = require('@/Server/ServerStart'); // Updated
const {runLooper} = require('@/utils/LooperRunner');
const {dbConnect} = require('@/config/dbConnect');
const {useRoutes} = require('@/Server/useRoutes');
const {MiddlewiresUser} = require('@/Server/MiddlewiresUser'); // Updated


useRoutes();
MiddlewiresUser();
StartServer();
dbConnect()
runLooper()


    // 404 handler (not found) should be defined before the error handler


