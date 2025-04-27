var DataTypes = require("sequelize").DataTypes;
var _asignacionobra = require("./asignacionobra");
var _historialvehiculoobra = require("./historialvehiculoobra");
var _obra = require("./obra");
var _permiso = require("./permiso");
var _producto = require("./producto");
var _rol = require("./rol");
var _rolpermiso = require("./rolpermiso");
var _usuario = require("./usuario");
var _vehiculo = require("./vehiculo");

function initModels(sequelize) {
  var asignacionobra = _asignacionobra(sequelize, DataTypes);
  var historialvehiculoobra = _historialvehiculoobra(sequelize, DataTypes);
  var obra = _obra(sequelize, DataTypes);
  var permiso = _permiso(sequelize, DataTypes);
  var producto = _producto(sequelize, DataTypes);
  var rol = _rol(sequelize, DataTypes);
  var rolpermiso = _rolpermiso(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);
  var vehiculo = _vehiculo(sequelize, DataTypes);

  permiso.belongsToMany(rol, { as: 'id_rol_rols', through: rolpermiso, foreignKey: "id_permiso", otherKey: "id_rol" });
  rol.belongsToMany(permiso, { as: 'id_permiso_permisos', through: rolpermiso, foreignKey: "id_rol", otherKey: "id_permiso" });
  asignacionobra.belongsTo(obra, { as: "id_obra_obra", foreignKey: "id_obra"});
  obra.hasMany(asignacionobra, { as: "asignacionobras", foreignKey: "id_obra"});
  historialvehiculoobra.belongsTo(obra, { as: "id_obra_obra", foreignKey: "id_obra"});
  obra.hasMany(historialvehiculoobra, { as: "historialvehiculoobras", foreignKey: "id_obra"});
  rolpermiso.belongsTo(permiso, { as: "id_permiso_permiso", foreignKey: "id_permiso"});
  permiso.hasMany(rolpermiso, { as: "rolpermisos", foreignKey: "id_permiso"});
  rolpermiso.belongsTo(rol, { as: "id_rol_rol", foreignKey: "id_rol"});
  rol.hasMany(rolpermiso, { as: "rolpermisos", foreignKey: "id_rol"});
  usuario.belongsTo(rol, { as: "id_rol_rol", foreignKey: "id_rol"});
  rol.hasMany(usuario, { as: "usuarios", foreignKey: "id_rol"});
  vehiculo.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(vehiculo, { as: "vehiculos", foreignKey: "id_usuario"});
  asignacionobra.belongsTo(vehiculo, { as: "id_vehiculo_vehiculo", foreignKey: "id_vehiculo"});
  vehiculo.hasMany(asignacionobra, { as: "asignacionobras", foreignKey: "id_vehiculo"});
  historialvehiculoobra.belongsTo(vehiculo, { as: "id_vehiculo_vehiculo", foreignKey: "id_vehiculo"});
  vehiculo.hasMany(historialvehiculoobra, { as: "historialvehiculoobras", foreignKey: "id_vehiculo"});

  return {
    asignacionobra,
    historialvehiculoobra,
    obra,
    permiso,
    producto,
    rol,
    rolpermiso,
    usuario,
    vehiculo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
