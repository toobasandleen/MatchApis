module.exports = (sequelize, DATATYPE) => {
  const Identity = sequelize.define
    (
      "Identity",
      {
        id: {
          type: DATATYPE.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
          primaryKey: true
        },
        name:
        {
          type: DATATYPE.STRING,
          allowNull: false,
          validate: {

          }
        },
        typeId: {
          type: DATATYPE.INTEGER,
          refrences:
          {
            model: 'Categories',
            key: 'id'
          }
        },
        // everything related to that identity
        meta: {
          type: DATATYPE.JSON
        },
        // 0 incase of team number of identity incase of player or coach 
        parentId: {
          type: DATATYPE.INTEGER,
          allowNull: true,
          refrences: {
            model: 'Identities',
            key: 'id'
          }

        }
      }
    );
  Identity.associate = function (models) {

    // identity and category relation 
    // each idenity belongs to one cateogry 
    Identity.belongsTo(models.categories, {
      foreignKey: "typeId",
      as: "categories"
    })


    // identity relation to itself
    // an identity(team) has many palyers
    Identity.hasMany(models.Identity, {
      foreignKey: 'parentId',
      as: 'children'
    });
    // an identity(player) belongs to a team
    Identity.belongsTo(models.Identity, {
      foreignKey: 'parentId',
      as: 'parent'
    });

  };
  return Identity;


}


