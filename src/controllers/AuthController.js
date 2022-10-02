const AuhServices = require('../services/AuhServices');

class AuthController {
    async Register(req, res, next) {
        try {
            const { refreshToken, ...rest } = await AuhServices.Register(req.body);

            const { accessToken } = rest.user;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });

            res.status(200).json(rest);
        } catch (error) {
            console.log('check error: ', error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server: ',
            });
        }
    }

    async Login(req, res) {
        try {
            const { refreshToken, ...rest } = await AuhServices.Login(req.body);

            const { accessToken } = rest.user;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });

            res.status(200).json(rest);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async RefreshToken(req, res) {
        try {
            const { refreshToken, ...rest } = await AuhServices.RefreshToken(req.body.token);

            const { accessToken } = rest.user;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });

            res.status(200).json(rest);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }
}

module.exports = new AuthController();
