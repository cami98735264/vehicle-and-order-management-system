const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehiculo', {
    id_vehiculo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    placa: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "placa"
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('Disponible','En tránsito','Obra finalizada','Mantenimiento'),
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    },
    tipo_vehiculo: {
      type: DataTypes.ENUM('tractocamión','doble troque'),
      allowNull: false
    },
    ultimo_mantenimiento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    proximo_mantenimiento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    historial: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vehiculo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_vehiculo" },
        ]
      },
      {
        name: "placa",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "placa" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
};
