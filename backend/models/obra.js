const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('obra', {
    id_obra: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_obra: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_fin_estimada: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    producto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cli: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    prioridad: {
      type: DataTypes.ENUM('Baja','Media','Alta',''),
      allowNull: false,
      defaultValue: "Baja"
    },
    contacto_nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contacto_numero: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    asesor_nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    asesor_contacto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    historial: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'obra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_obra" },
        ]
      },
    ]
  });
};
