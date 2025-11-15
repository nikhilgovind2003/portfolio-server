const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProjectTechnology = sequelize.define(
    "ProjectTechnology",
    {
      project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "projects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      technology_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "technologies",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "project_technology",
      timestamps: false,
      underscored: true,
    }
  );

  return ProjectTechnology;
};
