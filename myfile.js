const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./models');
const { register,login,createUs,GetAllUsers,deleteUser,updateUs } = require('./Controllers/authController');
const libraryRoutes = require('./Routes/libraryRoutes');
const gameRoutes=require('./Routes/gameRoutes');
app.use(express.json());
const cors = require('cors');
app.use(cors());




//Register with jwt
app.post('/RegisterAdmin',register);
//login with jwt
app.post('/login',login);
const auth = require("./middleware/auth");
//CRUD
app.post('/CreateUser',auth, createUs);
//get all users
app.get('/GetAllUsers',auth,GetAllUsers);
// //delete user
app.delete('/deleteUser',auth, deleteUser);
// update user
app.put('/updateUs', auth,updateUs);
app.use('/library', libraryRoutes );
app.use('/games',gameRoutes);


// db.sequelize.sync({ alter: false })
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch(err => {
//     console.error('Unable to sync the database:', err);
//   });

const PORT = process.env.PORT || 2000; // Default to port 3000 if PORT environment variable is not set

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports=app






                                                                              // For redis //
// we have first install redis client on our systems  npm install redis
// then we install redis server using brew => brew install redis
// then we start the redis server by the command =>  brew services start redis