
const express = require('express');
const router = express.Router();
const{register,login,createUs,GetAllUsers,deleteUser,updateUs} =require('../Controllers/authController')
const auth = require("../middleware/auth");

//Register with jwt
router.post('/RegisterAdmin', register);
//login with jwt
router.post('/login', login);
//CRUD
router.post('/CreateUser', auth, createUs);
//get all users
router.get('/GetAllUsers', auth, GetAllUsers);
// //delete user
router.delete('/deleteUser', auth, deleteUser);
router.put('/updateUs', auth, updateUs);
module.exports=router;
