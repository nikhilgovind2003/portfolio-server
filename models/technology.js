const { DataTypes } = require("sequelize");

// models/Technology.js
module.exports = (sequelize) => {
  const Technology = sequelize.define(
    "Technology",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "technologies",
      timestamps: true,
    }
  );


  Technology.associate = (models) => {
    Technology.belongsToMany(models.Projects, {
      through: "ProjectTechnologies",
      foreignKey: "technology_id",
      otherKey: "project_id",
      as: "projects",
    });
  };

  return Technology;
};
