const SiteServices = require('../services/SiteServices');

class SiteController {
    async GetListAddress(req, res) {
        try {
            const data = await SiteServices.GetListAddress();

            res.status(200).json({
                errCode: 0,
                errMessage: 'Successfully',
                data,
            });
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async GetListGender(req, res) {
        try {
            const data = await SiteServices.GetListGender();

            return res.status(200).json({
                errCode: 0,
                msg: 'ok',
                data,
            });
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetOneUser(req, res) {
        try {
            const data = await SiteServices.GetOneUser(req.query.userId);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetCategory(req, res) {
        try {
            const data = await SiteServices.GetCategory();

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }
}

module.exports = new SiteController();
