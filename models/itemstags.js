"use strict";

module.exports = function(sequelize, DataTypes) {
  var ItemsTags = sequelize.define("ItemsTags", {
    ItemId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return ItemsTags;
};
