const request=require('supertest')
const {client}=require('../config/redisConnection')
const { sequelize } = require('../models');
const app=require('../myfile')
let token;
beforeAll(async () => {
    await sequelize.authenticate(); // Ensure the database connection is established
    await client.connect(); // Ensure Redis connection is established
    token=await client.get('auth_token')

});
afterAll(async () => {
    await sequelize.close(); // Close the database connection
});

describe('Players related api test',()=>{
    describe('/create player api',()=>{
            //pass case
            it('should give 201 if player created successfully',async()=>
                {
                const apiData={ name: "Glenn Maxwel",
                                identityType: "player",
                                meta: { teamName: "Viper Strikers",
                                        position: "All-Rounder", 
                                        dateOfBirth: "1988-10-14", 
                                        nationality: "Australian", 
                                        cnic: "12056-7890323-4", 
                                        height: "6ft 0in", 
                                        weight: "185lbs", 
                                        highestScore: "145", 
                                        playerProfileUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/2018.02.03.15.11.21-Glenn_Maxwell_%28cropped%29.jpg" 
                                      }
                              }
                const checkRes=await request(app).post('/games/createIdentity?id=18').send(apiData).set('x_auth_token',token);
                expect(checkRes.statusCode).toBe(201);
        
    
            });
            it('should give 400 if team cnic is not in meta',async()=>{
                const apiData={ name: "Glenn Maxwell",
                    identityType: "player",
                    meta: { teamName: "Viper Strikers",
                            position: "All-Rounder", 
                            dateOfBirth: "1988-10-14", 
                            nationality: "Australian", 
                            cnic: "12345-6789012-4", 
                            height: "6ft 0in", 
                            weight: "185lbs", 
                            highestScore: "145", 
                            playerProfileUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/2018.02.03.15.11.21-Glenn_Maxwell_%28cropped%29.jpg" 
                          }
    }
            const checkRes=await request(app).post('/games/createIdentity?id=18').send(apiData).set('x_auth_token',token);
            expect(checkRes.statusCode).toBe(400);
    
    
    
    
            });
            
    
    
    
    
    });
    describe('/getPlayerbyid api check',()=>{
        it('should return the players by the id it is called',async()=>{
            const apiData=await request(app).get('/games/getPlayerById?id=3').set('x_auth_token',token);
            expect(apiData.statusCode).toBe(200);

        })
        it('should return 400 if id  do not exist',async()=>{
            const apiData=await request(app).get('/games/getPlayerById?id=2').set('x_auth_token',token);
            expect(apiData.statusCode).toBe(200);
        })

    });





    




})
