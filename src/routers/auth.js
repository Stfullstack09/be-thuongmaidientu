const express = require('express');

const AuthController = require('../controllers/AuthController');
const VerifyToken = require('../services/VerifyToken');

const router = express.Router();

//

const initAlAuth = (app) => {
    router.post('/register', AuthController.Register);
    router.post('/login', AuthController.Login);
    router.post('/login-admin', AuthController.LoginAdmin);
    router.post('/logout', VerifyToken.VerifyTokenAccess, AuthController.Logout);
    router.post('/refresh-token', VerifyToken.VerifyToken, AuthController.RefreshToken);

    app.use('/api/v1/auth', router);
};

module.exports = initAlAuth;
