const jwt = require('jsonwebtoken');
require('dotenv').config();

class VerifyToken {
    VerifyToken(req, res, next) {
        try {
            if (!req.cookies) {
                return;
            }

            const refreshToken = req.cookies.refreshToken || '';
            if (!refreshToken) {
                return res.status(403).json({
                    errCode: 1,
                    errMessage: 'Missing refreshToken',
                });
            }

            const decode = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT_REFRESH_TOKEN);

            req.body.refreshToken = refreshToken;

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    VerifyTokenAccess(req, res, next) {
        try {
            if (!req.cookies) {
                return;
            }

            const accessToken = req.cookies.accessToken || '';

            if (!accessToken) {
                return res.status(401).json({
                    errCode: 1,
                    errMessage: 'Invalid Token',
                });
            }

            const decode = jwt.verify(accessToken, process.env.SECRET_KEY_JWT_ACCESS_TOKEN);

            req.body.email = decode.email;

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    VerifyTokenAccessRole(req, res, next) {
        try {
            if (!req.cookies) {
                return;
            }

            const accessToken = req.cookies.accessToken || '';

            if (!accessToken) {
                return res.status(401).json({
                    errCode: 1,
                    errMessage: 'Invalid Token',
                });
            }

            const decode = jwt.verify(accessToken, process.env.SECRET_KEY_JWT_ACCESS_TOKEN);

            if (decode.roleId !== 'R3') {
                req.body.email = decode.email;

                next();
            } else {
                new Promise.reject();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }
}

module.exports = new VerifyToken();
