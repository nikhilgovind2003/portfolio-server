const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Projects = sequelize.define(
    "Projects",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      media_path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_alt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      tableName: "projects",
      timestamps: true,
      underscored: true,
    },
  );


  Projects.associate = (models) => {
  Projects.belongsToMany(models.Technology, {
    through: "ProjectTechnologies",
    as: "technologies",
    foreignKey: "projectId",
  });
};

  
  
  return Projects;
};
