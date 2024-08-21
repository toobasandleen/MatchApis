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

describe('Coaches related api test', () => {
    describe('/create coach api', () => {
        //pass case
        it('should give 201 if coach created successfully', async () => {
            const apiData =
            {
                name: "Test Coach",
                identityType: "coach",  // Ensure this matches the type in your categories
                meta: {
                    teamName: "Lightning FC",
                    experienceYears: 10,
                    cnic: "94301-0987654-1",  // Unique identifier
                    coachingStyle: "Defensive"
                }
            }


            const checkRes = await request(app).post('/games/createIdentity?id=18').send(apiData).set('x_auth_token', token);
            expect(checkRes.statusCode).toBe(201);


        });





    });










})
