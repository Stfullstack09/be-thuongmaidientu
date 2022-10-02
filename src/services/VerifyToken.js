const jwt = require('jsonwebtoken');
require('dotenv').config();

class VerifyToken {
    VerifyToken(req, res, next) {
        try {
            const Header = req.header('authorization');

            if (!Header) {
                return res.status(401).json({
                    errCode: 1,
                    errMessage: 'Invalid Token',
                });
            }

            const Token = Header.split(' ')[1];

            if (!Token) {
                return res.status(403).json({
                    errCode: 1,
                    errMessage: 'Missing Token',
                });
            }

            const decode = jwt.verify(Token, process.env.SECRET_KEY_JWT_REFRESH_TOKEN);

            req.body.token = Token;

            next();
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
