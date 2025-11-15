const { DataTypes } = require("sequelize");

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
        defaultValue: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
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
      through: models.ProjectTechnology,
      foreignKey: "technology_id",
      otherKey: "project_id",
      as: "projects_list",
    });
  };

  return Technology;
};
