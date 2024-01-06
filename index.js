const {error} = require('console');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
//const port = 3000;
const port = process.env.PORT || 3000;
const databaseName = 'GymFitnessManagement';





