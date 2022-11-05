const { Router } = require('express');
const SiteController = require('../controllers/SiteController');

const router = Router();

const homeRouter = (app) => {
    router.get('/', SiteController.home);

    app.use(router);
};

module.exports = homeRouter;
