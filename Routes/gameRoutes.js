
const express = require('express');
const router = express.Router();
const worldCupAuthentication = require("../middleware/wcAuth");
const worldCupAuthorization = require("../middleware/wcRoleAuth");


const { getVenue,getMatch,UserLogin,createCategory,getMatchDetails,
    createIdentity,getTeams,getTeambyId,teamPlayers,scheduleMatch,
    getAllUmpire, UserRegister,deleteTeam,playerById, updateIdentity,updateMatch
    ,getAllProducts,createProduct,deleteProd,createOrder,getAllOrders} = require('../Controllers/gameController');

// Authorization and athuntication
router.post('/UserLogin',UserLogin);
router.post('/UserRegister',UserRegister);

// create 
router.post('/createIdentity',worldCupAuthentication,worldCupAuthorization,createIdentity);
router.post('/scheduleMatch',worldCupAuthentication,scheduleMatch);
router.post('/addCategory', worldCupAuthentication,createCategory);
router.post('/AddProduct',)

// get  apis
router.get('/getAllTeams',worldCupAuthentication,getTeams);
router.get('/getTeambyId',worldCupAuthentication,getTeambyId);
router.get('/getTeamAndPlayers',worldCupAuthentication,teamPlayers);
router.get('/getPlayerById',worldCupAuthentication,playerById);
router.get('/getAllUmpires',worldCupAuthentication,getAllUmpire)
router.get('/getMatches',worldCupAuthentication,getMatch);
router.get('/getMatchDetails',worldCupAuthentication,getMatchDetails);
router.get('/getVenue',worldCupAuthentication,getVenue);

// update
router.put('/updateMatch',worldCupAuthentication,updateMatch);
router.put('/updateIdentity',worldCupAuthentication,updateIdentity);
// delete
router.delete('/deleteTeam',worldCupAuthentication,deleteTeam);
router.delete('/deleteTeam',worldCupAuthentication,deleteTeam);
// double api routes
router.get('/getProducts',getAllProducts);
router.post('/addProducts',createProduct);
router.delete('/deleteProduct',deleteProd);
router.post('/createOrder',createOrder);
router.get('/getAllOrders',getAllOrders);

module.exports=router;
