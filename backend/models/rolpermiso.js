const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rolpermiso', {
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'rol',
        key: 'id_rol'
      }
    },
    id_permiso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'permiso',
        key: 'id_permiso'
      }
    }
  }, {
    sequelize,
    tableName: 'rolpermiso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_rol" },
          { name: "id_permiso" },
        ]
      },
      {
        name: "id_permiso",
        using: "BTREE",
        fields: [
          { name: "id_permiso" },
        ]
      },
    ]
  });
};
