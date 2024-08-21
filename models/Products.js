module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define(
        "Products",
        {
            prod_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true,
                autoIncrement: true
            },
            prod_name: {
                type: DataTypes.STRING,
                allowNull: false,

            },
            prod_price: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 1
                }

            },
            prod_description: {
                type: DataTypes.STRING
            },

            image: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false,
        }
    );
    Products.associate = function (models) {
        Products.hasMany(models.Orders, {
            as: "Products",
            foreignKey: "product_id"

        })
    }

    return Products

}