module.exports=(sequelize,DataTypes)=>{
    const Books=sequelize.define(
        "Books",
        {
            title:
            {
                type:DataTypes.STRING,
                allowNull:false,
                unique:true,
                validate:{
                    notEmpty:true
                },
            },
            gener:{
                type:DataTypes.STRING,
            },
            copies:{
                type:DataTypes.INTEGER,
                validate:{
                    max: 20,                  
                    min: 0
                }
            },
            AuthorId:{
                type:DataTypes.INTEGER,
                references:{
                    model:'Authors',
                    key:'id'
                }
            }
        }    
    );
Books.associate=function(models){
    Books.belongsTo(models.Author)
}
return Books;



}
