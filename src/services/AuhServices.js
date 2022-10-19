const bcrypt = require('bcrypt');
require('dotenv').config();
const Op = require('Sequelize').Op;

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
                    address: data.address,
                    gender: data.gender,
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
                    msg: 'ok',
                    user: {
                        ...user,
                        accessToken,
                    },
                    accessToken: accessToken,
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

                console.log('check user', user);

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
                            refToken: refreshToken,
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
                        accessToken,
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

    async LoginAdmin(data) {
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
                        roleId: {
                            [Op.or]: ['R1', 'R2', 'R4'],
                        },
                    },
                    raw: true,
                });

                console.log('check user', user);

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
                            refToken: refreshToken,
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
                        accessToken,
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
            expiresIn: '1d',
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
                    raw: true,
                });

                console.log('check user :', user);

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

                console.log('check new token { accessToken, refreshToken } :', { accessToken, refreshToken });

                await db.Token.update(
                    {
                        refToken: refreshToken,
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
                        ...rest,
                        accessToken,
                    },
                    accessToken,
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

    async Logout(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userId) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        id: userId,
                    },
                });

                const checkToken = await db.Token.findOne({
                    where: {
                        userId: userId,
                    },
                });

                if (user && checkToken) {
                    await db.Token.update(
                        {
                            accessToken: null,
                            refToken: null,
                        },
                        {
                            where: {
                                userId: userId,
                            },
                        },
                    );

                    return resolve({
                        errCode: 0,
                        msg: 'ok',
                    });
                } else {
                    return resolve({
                        errCode: 10,
                        msg: 'error',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new AuhServices();
