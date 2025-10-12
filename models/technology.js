const { DataTypes } = require("sequelize");

// models/Technology.js
module.exports = (sequelize) => {
  const Technology = sequelize.define("Technology", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Technology.associate = (models) => {
    Technology.belongsToMany(models.Projects, {
      through: "ProjectTechnologies",
      as: "projects",
      foreignKey: "technologyId",
    });
  };

  return Technology;
};
