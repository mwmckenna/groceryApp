"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("ItemsTags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      ItemId: {
        type: DataTypes.INTEGER
      },
      TagId: {
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
    migration.dropTable("ItemsTags").done(done);
  }
};