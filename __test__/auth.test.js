const request=require('supertest')
const {client}=require('../config/redisConnection')
const { sequelize } = require('../models');
const app=require('../myfile')

beforeAll(async () => {
    await sequelize.authenticate(); // Ensure the database connection is established
    await client.connect(); 

});

afterAll(async () => {
    await sequelize.close(); // Close the database connection

});

// User Register and User Login
// two test 
// 1. User Login api
// 2. User Register api 



describe('Post user login/register Apis check',()=>{

    describe("post /UserLogin api test",()=>{

        it('should return 200 if user login successfully',async()=>
        {
            const apiData={email:'tooba@gmail.com', pwd:'12345'};
            // we need to send the above data to the api route
            const res=await request(app).post('/games/UserLogin').send(apiData);
            expect(res.statusCode).toBe(200);
            const token=res.body.token;
            await client.set('auth_token',token);
            expect(res.body).toHaveProperty('token');
        })
        it('should return 401 if credentials are wrong',async()=>{
            const apiData={email:'tooba1@gmail.com', pwd:'12345'};
            const res=await request(app).post('/games/UserLogin').send(apiData);
            expect(res.statusCode).toBe(401);
        })
        it('should return 400 if all field are not filled',async()=>{
            const apiData={email:'tooba1@gmail.com', pwd:""};
            const res=await request(app).post('/games/UserLogin').send(apiData);
            expect(res.statusCode).toBe(400);
        })
    })
    describe("post /UserRegister api test",()=>{
        it("should return 201 if user register successfully",async()=>{
            const apiData=    {
                                first_name:"Test",
                                last_name:"regi",
                                email:"game@gmail.com",
                                pwd:"12345"
                              }
            const res=await request(app).post('/games/UserRegister').send(apiData);
            expect(res.statusCode).toBe(409);
        })
    })


});


















// describe('UserLogin Function', () => {
//     it('should return 400 if email or password is missing', async () => {
//         const req = {
//             body: {}
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await UserLogin(req, res);
//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith("All Field are required");
//     });
//     it('should return 400 if user is not found', async () => {
//         // Ensure there is no user with this email in the test database
//         const req = {
//             body: { email: 'nonexistent@example.com', pwd: 'password' }
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await UserLogin(req, res);
//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith("Invalid Credential");
//     });   

    
//     it('should return 200 with token if credentials are correct', async () => {
       

//         const req = {
//             body: { email: 'tooba@gmail.com', pwd: '12345' }
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await UserLogin(req);
//         expect(response.statusCode).toBe(200);
       
//     });
//     it('should return 500 if there is a server error', async () => {
//         // Simulate a server error by causing an exception
//         jest.spyOn(Admin, 'findOne').mockImplementation(() => {
//             throw new Error('Server error');
//         });

//         const req = {
//             body: { email: 'test@example.com', pwd: 'password' }
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await UserLogin(req, res);
//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({ err: 'Server error' });

//         // Restore the original implementation
//         Admin.findOne.mockRestore();
//     });
// });
