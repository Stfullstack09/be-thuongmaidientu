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
}

module.exports = new SiteController();
