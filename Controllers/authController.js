const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Admin,User}=require('../models');



const register=async(req,res)=>{
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

}
const login=async(req,res)=>
{
  try
  { 
    console.log(process.env.TOKEN_KEY)
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
              { admin_id: corrUser.id, email },
              process.env.TOKEN_KEY,
              {
                
                expiresIn: "2h",
              }
        );
        corrUser.token = token;
        return res.status(200).json(corrUser);
        }
      else
        {
          return res.status(400).json("Either email or password is wrong");
        }
        
    }
    else{
      return res.status(400).json("Invalid Credential");
    }
  
  }
  catch(err){
    return res.status(500).json({err:err.message});

  }
}
// Cruds

const createUs=async (req,res)=>{
    try{
      const a_id=req.adminn.id;
      
      const newUserData = {
        ...req.body,
        created_by: a_id}
      const newUs= await User.create(newUserData);
      if(newUs){
        return res.status(201).json(newUs);
      }
      else
      {
        return res.status(500).json("Error Occur while creating user");
      }
    }
    catch(error){
      return res.status(500).json({error:error.message});
    }
}
const GetAllUsers=  async(req,res)=>
{
      try{
        const a_id=req.adminn.id;
       
        const allU=await User.findAll({where:{created_by:a_id}});
        return res.status(200).json(allU);
      }
      catch(err){
        return res.status(500).json({err:err.message});
      }
 
}
const deleteUser=async (req, res) => {
  try
  {
    const a_id=req.adminn.id;
      const chec= await User.destroy({where:
        {
          id:req.query.id,
          created_by: a_id
        }
      });
      if(chec){
        return res.status(200).json({"Id# ": req.query.id +" Deleted Sucessfully "});
      }
      else{
        return res.status(400).json("No Record for the Id is present or You don't have permission")
      }
  
  }
  catch(err)
  {
    return res.status(500).json({err:err.message});
  }

}

const updateUs=async (req,res)=>{
  try{
        const a_id=req.adminn.id;
        const u = await User.update(
          {
          fname : req.body.fname,
          lname : req.body.lname,
          age   : req.body.age
          },
          {
            where : {
              id:req.query.id,
              created_by: a_id
            }
          },

        );
        if(u[0]){
          return res.status(200).json("Data Updated Successully");
        }
        else{
          return res.status(400).json("No Record for the Id is present or You don't have permission")

        }

  }
  catch(err){
        return res.status(500).json({err:err.message});
  }
};


module.exports={createUs,register,login,GetAllUsers,deleteUser,updateUs};