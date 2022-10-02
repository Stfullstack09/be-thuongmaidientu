const express = require('express');

const AuthController = require('../controllers/AuthController');
const VerifyToken = require('../services/VerifyToken');

const router = express.Router();

const initAlAuth = (app) => {
    router.post('/register', AuthController.Register);
    router.post('/login', AuthController.Login);
    router.post('/refresh-token', VerifyToken.VerifyToken, AuthController.RefreshToken);

    app.use('/api/v1/auth', router);
};

module.exports = initAlAuth;
