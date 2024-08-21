module.exports = (sequelize, DATATYPE) => {
    const categories = sequelize.define
        (
            "categories",
            {
                id:
                {
                    type: DATATYPE.INTEGER,
                    allowNull: false,
                    unique: true,
                    autoIncrement: true,
                    primaryKey: true
                },
                typeOfCategory:
                {
                    type: DATATYPE.STRING,
                    allowNull: false,
                    unique: true
                }
            }
        );
    categories.associate = function (models) {
        categories.hasMany(models.Identity, {
            foreignKey: 'typeId',
            as: "Identities"

        })
    };
    return categories;

}

