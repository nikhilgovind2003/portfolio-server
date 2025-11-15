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
      github_link: {
        type: DataTypes.TEXT,
      },
      project_link: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      through: models.ProjectTechnology,
      foreignKey: "project_id",
      otherKey: "technology_id",
      as: "technologies_list",
    });
  };

  return Projects;
};
