'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Oder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Oder.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'productDataOder' });
            Oder.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' });
            Oder.belongsTo(models.Allcode, { foreignKey: 'size', targetKey: 'keyMap', as: 'SizeOderData' });
            Oder.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' });
        }
    }
    Oder.init(
        {
            userId: DataTypes.INTEGER,
            statusId: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            address: DataTypes.STRING,
            productId: DataTypes.INTEGER,
            note: DataTypes.STRING,
            size: DataTypes.STRING,
            uuid: DataTypes.STRING,
            count: DataTypes.INTEGER,
            totalMoney: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Oder',
        },
    );
    return Oder;
};
