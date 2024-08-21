const request = require('supertest')
const { client } = require('../config/redisConnection')
const { sequelize } = require('../models');
const app = require('../myfile')
let token;
beforeAll(async () => {
    await sequelize.authenticate(); // Ensure the database connection is established
    await client.connect(); // Ensure Redis connection is established
    token = await client.get('auth_token')

});
afterAll(async () => {
    await sequelize.close(); // Close the database connection
});

describe('Match related api test', () => {
    describe('/create match api', () => {
        //pass case
        it('should give 201 if match created successfully', async () => {
            const apiData =
            {
                team1Id: 18,
                team2Id: 42,
                umpireId: 16,
                venueId: 51,
                matchDate: "2024-08-01",
                matchTime: "21:30"
            }
            const checkRes = await request(app).post('/games/scheduleMatch').send(apiData).set('x_auth_token', token);
            expect(checkRes.statusCode).toBe(201);


        });




    });


})
