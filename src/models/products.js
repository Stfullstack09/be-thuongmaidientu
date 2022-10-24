'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsTo(models.Allcode, { foreignKey: 'categoryId', targetKey: 'keyMap', as: 'categoryData' });
            Product.hasMany(models.Cart, { foreignKey: 'productId', as: 'productData' });
            Product.hasMany(models.Oder, { foreignKey: 'productId', as: 'productDataOder' });
        }
    }
    Product.init(
        {
            categoryId: DataTypes.STRING,
            title: DataTypes.STRING,
            userId: DataTypes.STRING,
            price: DataTypes.INTEGER,
            discount: DataTypes.INTEGER,
            thumbnail: DataTypes.TEXT('long'),
            contentHTML: DataTypes.TEXT('long'),
            contentTEXT: DataTypes.TEXT('long'),
            deleted: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Product',
        },
    );
    return Product;
};
