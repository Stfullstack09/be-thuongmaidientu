const express = require('express');
const SiteController = require('../controllers/SiteController');

const router = express.Router();

const appRouter = (app) => {
    router.get('/listaddress', SiteController.GetListAddress);

    app.use('/api/v1/app', router);
};

module.exports = appRouter;
