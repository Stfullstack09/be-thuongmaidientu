const db = require('.././models/index');
const ConstantBE = require('.././utils/constant');

class SiteServices {
    GetListAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.Allcode.findAll({
                    where: {
                        type: ConstantBE.address,
                    },
                });

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetListGender() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.Allcode.findAll({
                    where: {
                        type: 'GENDER',
                    },
                });

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetOneUser(userId) {
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

    async GetCategory() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.Allcode.findAll({
                    where: {
                        type: ConstantBE.CATEGORY,
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new SiteServices();
