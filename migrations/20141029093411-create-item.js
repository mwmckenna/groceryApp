"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      brand: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.DECIMAL
      },
      ListId: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Items").done(done);
  }
};