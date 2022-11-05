'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            thumbnail: {
                type: Sequelize.STRING,
            },
            isPublic: {
                type: Sequelize.STRING,
            },
            countLike: {
                type: Sequelize.INTEGER,
            },
            countCMT: {
                type: Sequelize.INTEGER,
            },
            contentHTML: {
                type: Sequelize.TEXT('long'),
            },
            contentTEXT: {
                type: Sequelize.TEXT('long'),
            },
            time: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts');
    },
};
