"use strict";

module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    ListId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Item.belongsTo(models.List)
        Item.hasMany(models.Tag);
      }
    }
  });

  return Item;
};
