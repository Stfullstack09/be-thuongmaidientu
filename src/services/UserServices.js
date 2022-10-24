const db = require('../models');

class UserServices {
    async GetCurrentUser(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required email',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'genderData',
                        },
                        {
                            model: db.Allcode,
                            as: 'addressData',
                        },
                    ],
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt'],
                    },
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: user,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async UpdateCurrentUser(state) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!state.email || !state.firstName || !state.lastName || !state.address || !state.gender) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                await db.User.update(
                    {
                        firstName: state.firstName,
                        lastName: state.lastName,
                        address: state.address,
                        gender: state.gender,
                        avatar: state.avatar ? state.avatar : null,
                    },
                    {
                        where: {
                            email: state.email,
                        },
                    },
                );

                return resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new UserServices();
