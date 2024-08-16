// globalSetup.js
const { createConnection } = require('./redisConnection');

module.exports = async () => {
    await createConnection();
};
