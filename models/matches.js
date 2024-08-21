module.exports = (sequelize, DataTypes) => {
    const Matches = sequelize.define(
        "Matches",
        {
            team1Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Identities",
                    key: "id",


                }
            },
            team2Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Identities",
                    key: "id",
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                }
            },
            venueId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Identities",
                    key: "id"
                }
            },
            umpireId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Identities",
                    key: "id"
                }
            },
            status: {
                type: DataTypes.STRING,


            },
            matchDate: {
                type: DataTypes.DATEONLY,
                allowNull: false

            },
            matchTime: {
                type: DataTypes.TIME,
                allowNull: false

            }
        }
    );

    Matches.associate = function (models) {
        // Team 1 association
        Matches.belongsTo(models.Identity, {
            foreignKey: "team1Id",
            as: "team1", // table name
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        });

        // Team 2 association
        Matches.belongsTo(models.Identity, {
            foreignKey: "team2Id",
            as: "team2", // table name
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        });

        // Umpire association
        Matches.belongsTo(models.Identity, {
            foreignKey: "umpireId",
            as: "umpire",
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        });
        Matches.belongsTo(models.Identity, {
            foreignKey: "venueId",
            as: "venue",
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        });
    };

    return Matches;
};
