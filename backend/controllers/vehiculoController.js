// controllers/vehiculoController.js
const { sequelize } = require('../config/database/Connection');
const Vehiculo = require('../models/Vehiculo')(sequelize, require('sequelize').DataTypes);
const Usuario = require('../models/Usuario')(sequelize, require('sequelize').DataTypes);

Usuario.hasMany(Vehiculo, { foreignKey: 'id_usuario' });
Vehiculo.belongsTo(Usuario, { foreignKey: 'id_usuario' });


const createVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.create(req.body);
        res.status(201).json(vehiculo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el vehículo' });
    }
};

const getVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll({
            include: {
                model: Usuario,
                attributes: ['nombre_usuario', 'email'],
            },
            where: req.user.rol === 'Conductor' ? { id_usuario: req.user.id } : {},
        });
        res.json(vehiculos);
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: 'Error al obtener los vehículos' });
    }
};

const actualizarEstadoVehiculo = async (req, res) => {
    try {
      const { id_vehiculo, nuevo_estado } = req.body;
      const vehiculo = await Vehiculo.findOne({ where: req.user.rol === 'Coordinadora' ? { id_vehiculo } : { id_vehiculo, id_usuario: req.user.id } });
  
      if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
  
      await vehiculo.update({ estado: nuevo_estado });
      res.status(200).json({ message: 'Estado del vehículo actualizado', vehiculo });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado del vehículo' });
    }
  };
  

const getVehiculoById = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findOne({
            where: req.user.rol === 'Coordinadora' ? { id_vehiculo: req.params.id } : { id_vehiculo: req.params.id, id_usuario: req.user.id },
            include: {
                model: Usuario,
                attributes: ['nombre_usuario', 'email'],
            },
        });
        if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el vehículo' });
    }
};

const updateVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findOne({ where: req.user.rol === 'Coordinadora' ? { id_vehiculo: req.params.id } : { id_vehiculo: req.params.id, id_usuario: req.user.id } });
        if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });

        await vehiculo.update(req.body);
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el vehículo' });
    }
};

const deleteVehiculo = async (req, res) => {
    try {
        console.log(req.params.id);
        const vehiculo = await Vehiculo.findOne({ where: req.user.rol === 'Coordinadora' ? { id_vehiculo: req.params.id } : { id_vehiculo: req.params.id, id_usuario: req.user.id } });
        if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });

        await vehiculo.destroy();
        res.json({ message: 'Vehículo eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
};

const getHistorialVehiculo = async (req, res) => {
    try {
      const { id } = req.params;
      const historial = await Vehiculo.findOne({ where: { id_vehiculo: id, id_usuario: req.user.id }, attributes: ['historial'] });
  
      if (!historial) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
  
      res.status(200).json(historial.historial || []);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial del vehículo' });
    }
  };
  
module.exports = { createVehiculo, getVehiculos, getVehiculoById, updateVehiculo, deleteVehiculo, actualizarEstadoVehiculo, getHistorialVehiculo };
