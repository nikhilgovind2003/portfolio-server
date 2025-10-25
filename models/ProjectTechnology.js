const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProjectTechnology = sequelize.define("ProjectTechnology", {
    project_id: {
      type: DataTypes.INTEGER,
      references: { model: "projects", key: "id" },
      onDelete: "CASCADE",
    },
    technology_id: {
      type: DataTypes.INTEGER,
      references: { model: "technologies", key: "id" },
      onDelete: "CASCADE",
    },
  }, {
    tableName: "project_technologies",
    timestamps: false,
  });


    ProjectTechnology.associate = (models) => {
    ProjectTechnology.belongsTo(models.Projects, { foreignKey: "project_id" });
    ProjectTechnology.belongsTo(models.Technology, { foreignKey: "technology_id" });
  };



  return ProjectTechnology;
};
