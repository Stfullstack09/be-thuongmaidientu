const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('betmdt09', 'betmdt09', 'st6k8V0NA8NdzsxkMyvAVhYY4RfCMuLx', {
    host: 'dpg-cdueg9ha6gdv3sqbf1eg-a',
    dialect: 'postgres',
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;
