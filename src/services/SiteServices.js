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
}

module.exports = new SiteServices();
