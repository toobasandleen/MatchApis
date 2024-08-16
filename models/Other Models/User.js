module.exports=(sequelize,DataTypes) =>{
    const User = sequelize.define(
        "User",
        {
        fname:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty :true
                
            },
        },
        lname:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            },
        }, 
        age:{   
            type:DataTypes.INTEGER,
            allowNull:false,
            
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Admins', 
                key: 'id'
            }
        },
    });
    
    return User;
}