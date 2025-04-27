const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asignacionobra', {
    id_asignacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_obra: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'obra',
        key: 'id_obra'
      }
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vehiculo',
        key: 'id_vehiculo'
      }
    },
    fecha_asignacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado_obra: {
      type: DataTypes.ENUM('En tránsito','Obra finalizada'),
      allowNull: false
    },
    documento_finalizacion: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'asignacionobra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_asignacion" },
        ]
      },
      {
        name: "id_obra",
        using: "BTREE",
        fields: [
          { name: "id_obra" },
        ]
      },
      {
        name: "id_vehiculo",
        using: "BTREE",
        fields: [
          { name: "id_vehiculo" },
        ]
      },
    ]
  });
};
