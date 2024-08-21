module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define(
        "Orders",
        {
            order_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true,
                autoIncrement: true
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,


            },
            order_description: {
                type: DataTypes.STRING,


            },
            order_status: {
                type: DataTypes.ENUM('active', 'inactive'),
                validate: {
                    isIn: {
                        args: ['active', 'inactive'],
                        msg: "Order Status must be active or inactive"

                    }
                }

            },
            user_id: {
                type: DataTypes.INTEGER,

            }

        },
        {
            timestamps: false,
        }
    );
    Orders.associate = function (models) {
        Orders.belongsTo(models.Products, {
            as: "Products",
            foreignKey: "product_id"

        }),
            Orders.hasOne(models.OrderDetails, {
                as: 'OrderDetails',
                foreignKey: 'order_id'

            }),
            Orders.belongsTo(models.Admin, {
                as: 'Admin',
                foreignKey: "user_id"

            })
    }

    return Orders

}


// When you give refrences in the entity and you do not specify in assocaion it creates a seprate key for that association
// and the one associaion created by sequelize is shown in the workbench not the one in the enities 