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
      tableName: "projects",
      timestamps: true,
      underscored: true,
    }
    
  );

  // Define associations
  Projects.associate = (models) => {
    Projects.belongsToMany(models.Skills, {
      through: "ProjectSkills",
      foreignKey: "project_id",
      otherKey: "skill_id",
      as: "skills",
    });
    
  };

  return Projects;
};
