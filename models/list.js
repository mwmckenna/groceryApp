"use strict";

module.exports = function(sequelize, DataTypes) {
  var List = sequelize.define("List", {
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        List.hasMany(models.Item),
        List.belongsTo(models.User)
      }
    }
  });

  return List;
};
