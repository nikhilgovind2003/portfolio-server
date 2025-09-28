const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Contact = sequelize.define(
    "Contact",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "contacts",
      timestamps: true,
      underscored: true,
    }
  );

  return Contact;
};
