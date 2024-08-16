module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        pwd: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,         
            defaultValue: "manager"   
        }
    });
    Admin.associate=function(models){
        Admin.hasMany(models.Orders,{
            
            as:'Admin',
            foreignKey:"user_id"
        });
    
    };
    return Admin;
}
