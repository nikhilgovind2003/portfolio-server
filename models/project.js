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
        allowNull: true,
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
      technologies: {
        type: DataTypes.INTEGER,
        Reference: {
          
        }
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
    }
  );

  Projects.associate = (models) => {
    Projects.belongsToMany(models.Technology, {
      through: "ProjectTechnologies",
      foreignKey: "project_id",
      otherKey: "technology_id",
      as: "techList",
    });
  };

  return Projects;
};
