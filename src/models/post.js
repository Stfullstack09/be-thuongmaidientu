'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Post.belongsTo(models.User, {
                foreignKey: 'userId',
                targetKey: 'id',
                as: 'userDataPost',
            });
        }
    }
    Post.init(
        {
            userId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            thumbnail: DataTypes.STRING,
            isPublic: DataTypes.STRING,
            contentHTML: DataTypes.TEXT('long'),
            contentTEXT: DataTypes.TEXT('long'),
            time: DataTypes.STRING,
            countLike: DataTypes.INTEGER,
            countCMT: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Post',
        },
    );
    return Post;
};
