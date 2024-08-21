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

describe('Teams Apis Check', () => {

    describe('/getTeams api check', () => {

        it('should check if all teams data is fetching correctly', async () => {
            const fetchedData = await request(app).get('/games/getAllTeams').set('x_auth_token', token);
            expect(fetchedData.statusCode).toBe(200);
        })
        it('should give 403 if the token is not set ', async () => {
            const fetchedData = await request(app).get('/games/getAllTeams');
            expect(fetchedData.statusCode).toBe(403);
        })
    });
    describe('/getTeamsbyid api check', () => {
        it('should return the team by the id it is called', async () => {
            const apiData = await request(app).get('/games/getTeambyId?id=18').set('x_auth_token', token);
            expect(apiData.statusCode).toBe(200);

        })
        // 
    });
    describe('/create team api', () => {
        //pass case
        it('should give 201 if team created successfully', async () => {
            const apiData =
            {
                name: "Testing",
                identityType: "team",
                meta: {
                    country: "New Zealand",
                    founded: 2015,
                    homeCity: "Auckland",
                    teamColors: ["Black", "Silver"],
                    championshipsWon: 4,
                    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDGsWjkAz_hX9602ywjIVs7FZWLAIcdwTGg&s"
                }
            }
            const checkRes = await request(app).post('/games/createIdentity').send(apiData).set('x_auth_token', token);
            expect(checkRes.statusCode).toBe(201);


        })
        it('should give 400 if team name is not unique', async () => {
            const apiData = {
                name: "Wolf Pack", // team already exist
                identityType: "team",
                meta: {
                    country: "New Zealand",
                    founded: 2015,
                    homeCity: "Auckland",
                    teamColors: ["Black", "Silver"],
                    championshipsWon: 4,
                    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDGsWjkAz_hX9602ywjIVs7FZWLAIcdwTGg&s"
                }
            }
            const checkRes = await request(app).post('/games/createIdentity').send(apiData).set('x_auth_token', token);
            expect(checkRes.statusCode).toBe(400);




        })





    })
    // describe('/schedule Match apis',()=>{
    //     it('should give a 201 response if match created successfully',async()=>
    //     {
    //         const dataToBeSent={

    //                 team1Id: 7,
    //                 team2Id: 6,
    //                 umpireId: 16,
    //                 venueId: 51,
    //                 status: "Scheduled",
    //                 matchDate: "2012-08-07", 
    //                 matchTime: "04:30"



    //         }
    //         const apiCheck=await request(app).post('/games/scheduleMatch').send(dataToBeSent).set('x_auth_token',token)
    //         expect(apiCheck.statusCode).toBe(201);




    //     })






    // })




})