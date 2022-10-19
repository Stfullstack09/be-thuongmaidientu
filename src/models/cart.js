'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'productData' });
            Cart.belongsTo(models.Allcode, { foreignKey: 'size', targetKey: 'keyMap', as: 'sizeData' });
        }
    }
    Cart.init(
        {
            productId: DataTypes.STRING,
            userId: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.INTEGER,
            size: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Cart',
        },
    );
    return Cart;
};
