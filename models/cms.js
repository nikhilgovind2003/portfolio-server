const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cms = sequelize.define(
    "Cms",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      super_title: {
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
      btn_one_text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      btn_one_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      btn_two_text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resume: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      media_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_alt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      skills_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      about_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      about_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contact_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "cms",
      timestamps: true,
      underscored: true,
    }
  );

  return Cms;
};


