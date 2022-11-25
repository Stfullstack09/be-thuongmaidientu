const express = require('express');
const connectDB = require('./config/connectDB');
const initAlAuth = require('./routers/auth');
const appRouter = require('./routers/App');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const homeRouter = require('./routers/home');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());

app.use(function (req, res, next) {
    // Website you wish to allow to connect process.env.LOCAL_HOST
    res.setHeader('Access-Control-Allow-Origin', process.env.LOCAL_HOST);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// middleware
connectDB();
initAlAuth(app);
appRouter(app);
homeRouter(app);

app.listen(PORT, () => {
    console.log('App Starting successfully with port ', PORT);
});
