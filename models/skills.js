const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Skills = sequelize.define(
    "Skills",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      skills: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "skills",
      timestamps: true,
      underscored: true,
    }
  );



  // Define associations
  return Skills;
};
