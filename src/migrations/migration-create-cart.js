'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            productId: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.STRING,
            },
            shopId: {
                type: Sequelize.INTEGER,
            },
            note: {
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.STRING,
            },
            size: {
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
        await queryInterface.dropTable('Carts');
    },
};
