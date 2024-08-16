// globalTeardown.js
const { quitConnection } = require('./redisConnection');

module.exports = async () => {
    await quitConnection();
};
