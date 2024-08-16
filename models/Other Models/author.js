module.exports= (sequelize,DataTypes)=>{
    const Author= sequelize.define(
        "Author",
        {
            Name:{
                type:DataTypes.STRING
            },
            PhoneNumber:{
                type:DataTypes.INTEGER
            },
            Bio:{
                type:DataTypes.STRING
            }

        }
    );
    Author.associate=function(models){

        Author.hasMany(models.Books)

    }
    return Author;
}