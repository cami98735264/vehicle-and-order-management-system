const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('historialvehiculoobra', {
    id_historial: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vehiculo',
        key: 'id_vehiculo'
      }
    },
    id_obra: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'obra',
        key: 'id_obra'
      }
    },
    fecha_visita: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    producto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'historialvehiculoobra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_historial" },
        ]
      },
      {
        name: "id_vehiculo",
        using: "BTREE",
        fields: [
          { name: "id_vehiculo" },
        ]
      },
      {
        name: "id_obra",
        using: "BTREE",
        fields: [
          { name: "id_obra" },
        ]
      },
    ]
  });
};
