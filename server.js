require('module-alias/register');
require('dotenv').config();


const {StartServer  } = require('@/Server/ServerStart'); // Updated
const {runLooper} = require('@/utils/looperRunner');
const {useRoutes} = require('@/Server/useRoutes');
const {MiddlewiresUser} = require('@/Server/MiddlewiresUser'); // Updated

 
useRoutes();
MiddlewiresUser();
StartServer();
runLooper()


    // 404 handler (not found) should be defined before the error handler


