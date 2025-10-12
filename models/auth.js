const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Auth = sequelize.define(
    "Auth",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "auth",
      timestamps: true,
      underscored: true,
    }
  );

  return Auth;
};
