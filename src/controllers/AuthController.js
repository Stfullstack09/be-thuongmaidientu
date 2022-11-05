const AuhServices = require('../services/AuhServices');

class AuthController {
    async Register(req, res, next) {
        try {
            const { refreshToken, accessToken, ...rest } = await AuhServices.Register(req.body);

            if (refreshToken && accessToken) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });
            }

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
            const { refreshToken, accessToken, ...rest } = await AuhServices.Login(req.body);

            if (refreshToken && accessToken) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });
            }

            res.status(200).json(rest);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async LoginAdmin(req, res) {
        try {
            const { refreshToken, accessToken, ...rest } = await AuhServices.LoginAdmin(req.body);

            if (refreshToken && accessToken) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });
            }

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
            const { refreshToken, accessToken, ...rest } = await AuhServices.RefreshToken(req.body.refreshToken);

            if (refreshToken && accessToken) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    Priority: 'medium',
                    maxAge: new Date(Number(new Date()) + 31536000000),
                });
            }

            res.status(200).json(rest);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async Logout(req, res) {
        try {
            const data = await AuhServices.Logout(req.body.userId);

            if (data && data.errCode === 0) {
                res.clearCookie('accessToken', { path: '/' });
                res.clearCookie('refreshToken', { path: '/' });
            }

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

module.exports = new AuthController();
