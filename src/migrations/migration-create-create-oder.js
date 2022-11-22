'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Oders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            note: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            productId: {
                type: Sequelize.INTEGER,
            },
            statusId: {
                type: Sequelize.STRING,
            },
            uuid: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            discount: {
                type: Sequelize.INTEGER,
            },
            totalMoney: {
                type: Sequelize.INTEGER,
            },
            timeOder: {
                type: Sequelize.STRING,
            },
            timeBank: {
                type: Sequelize.STRING,
            },
            timeVC: {
                type: Sequelize.STRING,
            },
            timeDone: {
                type: Sequelize.STRING,
            },
            size: {
                type: Sequelize.STRING,
            },
            count: {
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
        await queryInterface.dropTable('Oders');
    },
};
