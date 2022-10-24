const UserServices = require('../services/UserServices');

class UserController {
    async GetCurrentUser(req, res) {
        try {
            const data = await UserServices.GetCurrentUser(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async UpdateCurrentUser(req, res) {
        try {
            console.log('check invalid connected');
            const data = await UserServices.UpdateCurrentUser(req.body);

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

module.exports = new UserController();
