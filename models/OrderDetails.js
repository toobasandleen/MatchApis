module.exports = (sequelize, DataTypes) => {
    const OrderDetails = sequelize.define(
        "OrderDetails",
        {
            orderDetial_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
                allowNull: false
            },
            orderDetial_Status:
            {
                type: DataTypes.ENUM('Delivered', 'OnWay', 'Placed', 'Returned To Destination')
            },
            orderDetial_descripton: {
                type: DataTypes.STRING

            },
            order_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Orders',
                    key: 'order_id'
                }

            }

        }
    );
    OrderDetails.associate = function (models) {
        OrderDetails.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'Orders'
        })
    }


    return OrderDetails

}