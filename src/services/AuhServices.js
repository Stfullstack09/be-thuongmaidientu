const bcrypt = require('bcrypt');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const db = require('../models/index');

class AuhServices {
    async Register(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.password || !data.firstName || !data.lastName) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameters',
                    });
                }

                const CheckEmailIsNotExitSystem = await this.checkEmail(data.email);

                if (CheckEmailIsNotExitSystem) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Your email already exists in the system',
                    });
                }

                const password = await this.hasPassWord(data.password);

                await db.User.create({
                    email: data.email,
                    password: password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    lastName: data.lastName,
                    roleId: 'R3',
                });

                const user = await db.User.findOne({
                    where: {
                        email: data.email,
                    },
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt'],
                    },
                    raw: true,
                });

                if (!user) {
                    reject();
                }

                const { firstName, lastName, email, roleId } = user;

                const { accessToken, refreshToken } = await this.generateToken({ firstName, lastName, email, roleId });

                await db.Token.create({
                    userId: user.id,
                    accessToken: accessToken,
                    refToken: refreshToken,
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Successfully',
                    user: {
                        ...user,
                        accessToken: accessToken,
                    },
                    refreshToken,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async Login(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.password) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Missing or invalid email',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email: data.email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Your account is not already existed in the system',
                    });
                }

                const checkPassword = bcrypt.compareSync(data.password, user.password);

                if (checkPassword) {
                    const { password, createdAt, updatedAt, ...rest } = user;

                    const { firstName, lastName, email, roleId } = rest;

                    const { accessToken, refreshToken } = await this.generateToken({
                        firstName,
                        lastName,
                        email,
                        roleId,
                    });

                    await db.Token.update(
                        {
                            ref: refreshToken,
                            accessToken: accessToken,
                        },
                        {
                            where: {
                                userId: user.id,
                            },
                        },
                    );

                    return resolve({
                        errCode: 0,
                        errMessage: 'Successfully',
                        user: {
                            ...rest,
                            accessToken,
                        },
                        refreshToken,
                    });
                } else {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Wrong password',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateToken(user) {
        const accessToken = await jwt.sign(user, process.env.SECRET_KEY_JWT_ACCESS_TOKEN, {
            expiresIn: '1h',
        });

        const refreshToken = await jwt.sign(user, process.env.SECRET_KEY_JWT_REFRESH_TOKEN, { expiresIn: '365d' });

        return {
            accessToken,
            refreshToken,
        };
    }

    async RefreshToken(refreshTokenVerify) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('check Token :', refreshTokenVerify);

                const TokenUser = await db.Token.findOne({
                    where: {
                        refToken: refreshTokenVerify,
                    },
                    raw: true,
                });

                if (!TokenUser) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Token is not valid',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        id: TokenUser.userId,
                    },
                });

                if (!user) {
                    return resolve({
                        errCode: 5,
                        errMessage: 'Token valid , but user match with refToken not found in database',
                    });
                }

                const { password, createdAt, updatedAt, ...rest } = user;

                const { firstName, lastName, email, roleId } = rest;

                const { accessToken, refreshToken } = await this.generateToken({
                    firstName,
                    lastName,
                    email,
                    roleId,
                });

                await db.Token.update(
                    {
                        ref: refreshToken,
                        accessToken: accessToken,
                    },
                    {
                        where: {
                            userId: user.id,
                        },
                    },
                );

                return resolve({
                    errCode: 0,
                    errMessage: 'RefreshToken successfully',
                    user: {
                        ...user,
                        accessToken,
                    },
                    refreshToken,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async hasPassWord(password) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!password) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameters',
                    });
                }

                const salt = await bcrypt.genSalt(10);

                const hashPassWord = await bcrypt.hashSync(password, salt);

                return resolve(hashPassWord);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async checkEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameters',
                    });
                }

                let Valid = false;

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                });

                if (user) {
                    Valid = true;
                }

                return resolve(Valid);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
}

module.exports = new AuhServices();
