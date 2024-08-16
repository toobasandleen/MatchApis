const { Op, where } = require('sequelize');
const {Admin,categories,Identity,Matches,Products,OrderDetails,Orders, sequelize}=require('../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const UserLogin = async(req,res)=>{
  {
    try
    { 
      const {email,pwd}=req.body;
      if(!(email&&pwd)){
        return res.status(400).json("All Field are required");
      }
      const corrUser=await Admin.findOne({where:{email}});
      if(corrUser)
      {
        const pwdCheck=await bcrypt.compare(pwd,corrUser.pwd);
        if(pwdCheck)
          {
          const token = jwt.sign
          (
                { admin_id: corrUser.id, email,role:corrUser.role }, // token generaion on three things in payload
                process.env.TOKEN_KEY, // enviorment variable
                { // options
                  expiresIn: "8h",
                }
          );
          corrUser.token = token;
          return res.status(200).json(corrUser);
          }
        else
          {
            return res.status(401).json("Either email or password is wrong");
          }
          
      }
      else{
        return res.status(401).json("Invalid Credential");
      }
    
    }
    catch(err){
      return res.status(500).json({err:err.message});
  
    }
  }
};
const UserRegister=async(req,res)=>{
  try{
    const { first_name, last_name, email, pwd } = req.body;

   
    
    if (!(email && pwd && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await Admin.findOne({ where: { email } })
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(pwd, 10);
    const admin = await Admin.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      pwd: encryptedPassword,
    });

    return res.status(201).json(admin);

  }
  catch(err){
    return res.status(500).json({error:err.message});
  }

};
// create category
const createCategory= async (req,res)=>{
    try{

        const newC=req.body;
        const b=await categories.create(newC);
        return res.status(201).json("Categorey Added Successfully");
     
    }
    catch(err){
        return res.status(500).json({err:err.message});
    }
};
// create team, create player, create umpire, create 
const createIdentity= async (req,res)=>{
    try
    {
        const {identityType,...rest}=req.body;
        let typeId, parentId = null;
        const selctedCategory= await categories.findOne({where:{typeOfCategory:identityType}}); 
        if(!selctedCategory){
            return res.status(400).json({ error: "Invalid identityType" });
        }
        typeId=selctedCategory.id;
        if(typeId===2||typeId===3||typeId===4) // for players or coaches or ampire
        {
          

          if(typeId!==4) { // for parent id in case of coach and player only 
            
            const playerTeam=await Identity.findOne({where:{id:req.query.id,typeId:1}});
            if(!playerTeam){
              return res.status(400).json({error: "Team  not specified or No team for the id exist "});
            }
            parentId=playerTeam.id;
          }
          // in case of empire parentId be null
          // check for no duplicate coach plaeyer or empire
          const checkForDuplication=await Identity.findOne({where:{'meta.cnic':req.body.meta.cnic}});
          if(checkForDuplication){
            return res.status(400).json({err:"Cnic issue or identity already exist"});
          }

          
          const newIden={typeId,parentId,...rest};
          const b=await Identity.create(newIden);
          return res.status(201).json("Identity Added Successfully"); 


        }
        else if(typeId===1)
        {
          const checkTeam=await Identity.findOne({where:{name:req.body.name}})
          if(checkTeam){
            return res.status(400).json({err:"Identity  Name Already Exist"});
          }

          const newTeam={typeId,...rest};
          const b=await Identity.create(newTeam);
          return res.status(201).json("Identity Added Successfully");
        }
        else {
          const checkTeam=await Identity.findOne({where:{name:req.body.name}})
          if(checkTeam){
            return res.status(400).json({err:"Identity  Name Already Exist"});
          }

          const newIden={typeId,...rest};
          const b=await Identity.create(newIden);
          return res.status(201).json("Identity Added Successfully");
        }
      
     
    }
    catch(err){
        return res.status(500).json({err:err.message});
    }
};
const scheduleMatch = async (req, res) => {
  try {
    const { team1Id, team2Id, umpireId, matchDate,venueId } = req.body;
    //assume match_Date is in YYYY-MM-DD format and match_Time in HH:MM format
    const match_Date1 = new Date(matchDate); 
    const teams = await Identity.findAll({
      where: {
        [Op.or]: [
          { id: team1Id, typeId: 1 },
          { id: team2Id, typeId: 1 },
          { id: venueId, typeId: 5 },
          { id: umpireId, typeId: 4 }
        ]
      }
    });
  

    if (teams.length === 4) 
    {
    const matchCount =await Matches.count({where:{matchDate:match_Date1}});
   
    if(matchCount<2) // this condition verifies that on each day only two matches can be sceduled 
    {
      const teamMatchValidation = await Matches.findOne({
        where: {
          matchDate: match_Date1,
          [Op.or]:[
            {team1Id:team1Id},
            {team1Id:team2Id},
            {team2Id:team1Id},
            {team2Id:team2Id},
            
          ],
        }
      });
      // check for Teams do not have any match scheduled on the date
      if(teamMatchValidation){
        return res.status(401).json({Err:"Team 1 or Team 1 already have match sceduled on the specified date"})
      }
      // Venue Availability check
      const venuecheck=await Matches.findOne({where:{matchTime:match_Date1,venueId:venueId}});

      if(venuecheck){
        return res.status(401).json({Err:"Venue is not available for today"});
      }
      
      if(!teamMatchValidation && !venuecheck)
      {    
        const newMatch = await Matches.create(req.body);
        if (newMatch) {
          res.status(201).json({
            message: "Match scheduled successfully",
            match: newMatch
          });
        } else {
          res.status(400).json({ err: "Creation Error" });
        }
      } 
      else 
      {
        return res.status(401).json({ error: "Following potention error possible\n 1. Either one or both team has already match scheduled on the same day\n2. Either Venue is not availabe " });
      }      

    }
    else{
    return res.status(400).json({Error:"Already 2 match scheduled on the selected Date"});
    }

    } 
    else {
      res.status(404).json({ err: "Either one or more selected item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllCategory=async(req,res)=>{
  try{

    const listOfcateg=await categories.findAll();
    res.status(200).json(listOfcateg);
  }
  catch(err)
  {
    res.status(500).json({err:err.message});
  }


};
const getAllIdentites=async(req,res)=>{
  try{

    const listIden=await Identity.findAll();
    res.status(200).jons(listIden);
  }

  catch(err){
    res.status(200).json({err:err.message});

  }
};
const getTeams =async(req,res)=>{
    try{

        const teams=await Identity.findAll({where:{typeId:1},attributes:['id','name','meta']});
        return res.status(200).json(teams);
    }
    catch(err){
        return res.status(500).json({err:err.message});
    }
    
};
const getTeambyId = async (req, res) => {
    try {
     
      const selectedTeam = await Identity.findOne({
        where: {
          id: req.query.id,
          typeId: 1
        },
      });
  
      if (selectedTeam) {
        return res.status(200).json(selectedTeam);
      } else {
        return res.status(404).json({ error: "Team not found or does not meet the criteria" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
};
const teamPlayers = async (req, res) => {
  try {
    const team = await Identity.findOne({
      where: {
        typeId: 1, 
        id: req.query.id
      },
      attributes:["id","name","meta"]
      ,
      include: [{
        model: Identity,
        as: 'children',
        attributes: ["name", "id", "typeId", "meta", "parentId"] // Include desired attributes of children
      }]
    });

    if (team) {
      const players = team.children || []; // Extract children (players) or return an empty array if none

      return res.status(200).json(team);
    } else {
      return res.status(404).json({ error: "Team not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const playerById=async(req,res)=>{
  try{

    const player=await Identity.findOne({where:{id:req.query.id,typeId:2,parentId:req.query.teamId}});
    if(player){
      return res.status(200).json({data:player});

    }
    else{
      return res.status(400).json({Error:"wrong Id of player or team paassed"});
    }
  }
catch(err){
  return res.status(200).json({err:err.message});
}


};
const getAllUmpire=async(req,res)=>{
  try
  {
    const umpires=await Identity.findAll({where:{typeId:4}})
    if(umpires){
        return res.status(200).json(umpires);
    }
    else{
      return res.status(400).json({err:err.message});
    }
  }
  catch(err){
    return res.status(500).json({err:err.message});
  }
};
const getAllCoaches=async(req,res)=>{
  try
  {
    const coaches=await Identity.findAll({where:{typeId:3}})
    if(coaches){
        return res.status(200).json(coaches);
    }
    else{
      return res.status(400).json({err:err.message});
    }
  }
  catch(err){
    return res.status(500).json({err:err.message});
  }
};
const getVenue= async(req,res)=>{
  try{
    const ListOfVenue=await Identity.findAll({where:{typeId:5}});
    if(ListOfVenue){
      return res.status(200).json(ListOfVenue);

    }
    else{
      return res.status(400).json({Error:"No record found"});
    }


  }
  catch(err){
    res.status(500).json({err:err.message});
  }
};
const getMatch=async(req,res)=>{
  const matchesList=await Matches.findAll({
    include:
    [
    {
      model:Identity,
      as:"team1",
      attributes:['name','meta']
    },
    {
      model:Identity,
      as:'team2',
      attributes:['name','meta']
    },
    {
      model:Identity,
      as:'venue',
      attributes:['name']
    }
  ],
  attributes:['id','status','matchDate','matchTime']


  });
  if(matchesList){
    return res.status(200).json(matchesList);
  }
  else{
    return res.status(400).json({Error:"Error occur while fetching"})
  }
};
const getMatchDetails =async(req,res)=>{
  try{
    const matchDetails=await Matches.findOne({
      where:{id:req.query.id},
      attributes:['id','venueId','status','matchDate','matchTime'],
      include:
      [
        {
          model:Identity,
          as:"team1",
          attributes:['name','meta'],
          where: 
          {
            typeId: 1
          },
          include:[{
            model:Identity,
            as:"children",
            attributes:['name','meta']
          }]
        },
        {
          model:Identity,
          as:"team2",
          attributes:['name','meta'],
          where: 
          {
            typeId: 1
          },
          attributes:['name','meta'],   include:[{
            model:Identity,
            as:"children", 
            attributes:['name','meta']
          }]
      
        },
        {
          model:Identity,
          as:"umpire",
          attributes:['name','meta']
      
        },
        {
          model:Identity,
          as:'venue',
          attributes:['name','meta']
        }

      ]
    });
    if(matchDetails){
      return res.status(200).json([matchDetails]);
    }
    else{
      return res.status(400).json({Err:"Error occur while fetching"});
    }
  }
  catch(err){
    return res.status(500).json({err:err.message});
  }
 


};                                                          // update apis
const updateIdentity=async(req,res)=>{
try{
  const checkIdentity=await Identity.findOne({where:{id:req.query.id}});
  if(checkIdentity)
  { 
    const updatedIdentity=req.body;
      // for player or coach or umpire
      if(checkIdentity.typeId===2 || checkIdentity.typeId===3)
      {


        if(checkIdentity.parentId!==null)
        {
            const updatedData=await Identity.update(
              {meta:updatedIdentity.meta},
              {where:
              {
                  id:checkIdentity.id
              }
              }
            );
            if(updatedData[0]){
              return res.status(200).json("Data Updated Successully");

            }
            else
            {
              return res.status(400).json("No Record for the Id is present or You don't have permission")

            }

            
        }
        else
        {
            return res.status(400).json({Erro:"No team Associated found!"});
        }

      }
      const u=await Identity.update(
          {meta:updatedIdentity.meta},
          {
            where:
                {
                    id:checkIdentity.id
                }
              

          }
      ); 

      if(u[0]){
        return res.status(200).json("Data Updated Successully");
      }
    
  }
  else{
    return res.status(400).json("No Record for the Id is present or You don't have permission")

  }
}
  
catch(err){
  return res.status(500).json({err:err.message});
}

};
const updateMatch = async (req,res)=>{
  try {
    const { umpireId, matchDate,matchTime,venueId,team1Id,team2Id } = req.body;
    const match_Date1 = new Date(matchDate); 
  
    const matchCount =await Matches.count({where:{matchDate:match_Date1}});
   
    if(matchCount<2) // this condition verifies that on each day only two matches can be sceduled 
    {
      const teamMatchValidation = await Matches.findOne({
          where: {
            matchDate: match_Date1,
            [Op.or]:[
              {team1Id:team1Id},
              {team1Id:team2Id},
              {team2Id:team1Id},
              {team2Id:team2Id},
            ],
          }
        });  
      if(teamMatchValidation){
          return res.status(401).json({Err:"Team 1 or Team 1 already have match sceduled on the specified date"})
      }
      const venuecheck=await Matches.findOne({where:{matchTime:match_Date1,venueId:venueId}});

      if(venuecheck){
        return res.status(401).json({Err:"Venue is not available for today"});
      }
      
      if(!teamMatchValidation && !venuecheck)
      {    
        const updatedMatch = await Matches.update(
          {
            matchDate:matchDate,
            matchCount:matchCount,
            umpireId:umpireId,
            matchTime:matchTime
          },
          {where:{id:req.query.id}}
        
        );
        if(updatedMatch[0]) 
        {
          res.status(200).json({
            message: "Match updated successfully"
          });
        } 
        else 
        {
          res.status(400).json({ err: "Creation Error" });
        }
      } 
      else 
      {
        return res.status(401).json({ error: "Following potention error possible\n 1. Either one or both team has already match scheduled on the same day\n2. Either Venue is not availabe " });
      }      

    }
    else{
    return res.status(400).json({Error:"Already 2 match scheduled on the selected Date"});
    }

    
 
  }
  catch(err){
    res.status(500).json({err:err.message})
  }




};                                                        // Delete apis
const deleteTeam = async(req,res)=>{
  try{
    const delTeam=await Identity.destroy({where:{id:req.query.id||req.params.id}})
    if(delTeam){
      return res.status(200).json({Message:"Team deleted Successfully and players Team id is set to null"})
    }
    else{
      return res.status(400).json({Error:"Error occur"})
    }
  }
  catch(err){
    return res.status(500).json({err: err.message});
  }
    
};
const deleteIdentity =async(req,res)=>{
  try{
      
    await Identity.destroy({where:{id:req.query.id}});
      
  }
  catch(err){
    return res.status(500).json({err:err.message});
  }
};
const getAllProducts=async(req,res)=>{
  try{

    const allProd=await Products.findAll();
    return res.status(200).json(allProd);

  }
  catch(err){
    return res.status(500).json({err:err.message});



  }

}
const createProduct=async(req,res)=>{
try
{  
  const newProd=await Products.create(req.body);
  if(newProd)
  {
    return res.status(201).json({Message:"Product Added Sucessfully"});


  }



}
catch(err){
return res.status(500).json({err:err.message});
}


};
const updateProduct=async(req,res)=>{
  try
  {
      const productToBeUpdated=req.body;
      const updatedProduct=await Products.update(
        {where:{prod_id:req.query.id}},
        {
          prod_name:productToBeUpdated.name,
          prod_price:productToBeUpdated.prod_price,
          prod_description:productToBeUpdated.prod_description,
          image:productToBeUpdated.image
        }
      )
      if(updatedProduct[0])
      {
        return res.status(200).json("Prouct Updated Sucessfully");
      }

  }
  catch(err){

      return res.status(500).json({err:err.message});

  }
};
const deleteProd=async(req,res)=>{
  try{
    const deletedProduct=Products.destroy({where:{id:req.query}});
    if(deletedProduct){
      return res.status(200).json({Message:"Product Deleted Sucessfully"});
    }
   

  }
  catch(err){
    return res.status(500).json({err:err.message});
  }

};
const createOrder=async(req,res)=>
{
  //unmanaged transactions
  const t =await sequelize.transaction();
  try{


  const {order_description,user_id}=req.body;
  const order_status="Active";

  const checkUser=await Admin.findOne({where:{id:user_id}});
  const checkProd=await Products.findOne({where:{prod_id:req.query.id}});
    
  if(checkProd&&checkUser){
    const newOrder=await Orders.create(
      {
        product_id:req.query.id,
        user_id:user_id,
        order_description:order_description,
        order_status:order_status.toLocaleLowerCase(),
      },
      {
        transaction:t
      }
    );
    if(newOrder){
  
      const orderId=newOrder.order_id;
      const orderDetial_Status="Placed";
      const orderDetial_descripton="The Product Order has been recieved and you will  be informed once it is dispatched";
      const newOrderDetails=await OrderDetails.create({
        order_id:orderId,
        orderDetial_Status:orderDetial_Status,
        orderDetial_descripton:orderDetial_descripton,
      },
      {
        transaction:t
      }
      
    );
  
      if(newOrderDetails)
      {
        const newObj={
            product_id:newOrder.product_id,
            order_id:newOrder.order_id,
            order_status:newOrder.order_status,
            order_description:newOrder.order_description,
            orderDetial_Status:newOrderDetails.orderDetial_Status,
            orderDetial_descripton:newOrderDetails.orderDetial_descripton
        }
        await t.commit();
        return res.status(200).json(newObj);
      }
      else{
        await t.rollback();
  
        return res.status(401).json({Err:"Error Occur"});
      }
  
    }
      
    else{
      return res.status(401).json({Err:"Order Creation Error"})
    }

  }
  else{
    return res.status(400).json({Err:"Either Product of user id is incorrect"});

  }
  }
  catch(err){
    return res.status(500).json({err:err.message})

  }



};
const getAllOrders=async(req,res)=>{
  try
  {
    const getAllOrders=await Orders.findAll(
      {
        where:{order_status:"active",user_id:req.query.id}

      },
      {
        
        include:[
          {
            model:OrderDetails,
            as:"OrderDetails"
          }
        ]
      })

      if(getAllOrders){
        return res.status(200).json(getAllOrders);
      }
      else{
        return res.status(400).json({Err:"Error Occur"})

      }
  }
  catch(err){
    return res.status(500).json({err:err.message})
  }

  
};
const getOrderbyId=async(req,res)=>{

}
const updateOrderStatus=async(req,res)=>{
  const orderStatus=req.body;
  const updatedOrder=await Orders.update(
  {
    where:{order_id:req.query.id}
  },
  {
    order_status:toLowerCase(orderStatus)
  }
)
  if(updatedOrder[0]){
    return res.status(200).json({Message:"Order Status updated successfully"});
  }
  else{
    return res.status(400).json({Err:"Error Occur"});
  }

};

const deleteOrder=async(req,res)=>{




}




module.exports={getMatch,getVenue,getMatchDetails,
  createCategory,getAllCoaches,createIdentity,
  getTeams,getTeambyId,teamPlayers,scheduleMatch,
  UserLogin,UserRegister,deleteTeam,playerById,getAllUmpire,
  updateIdentity,updateMatch,getAllProducts,deleteProd,
  createProduct,createOrder,updateProduct,getAllOrders}