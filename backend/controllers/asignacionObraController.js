// controllers/asignacionObraController.js
const { sequelize } = require('../config/database/Connection');
const AsignacionObra = require('../models/asignacionobra')(sequelize, require('sequelize').DataTypes);
const Obra = require('../models/Obra')(sequelize, require('sequelize').DataTypes);
const Vehiculo = require('../models/Vehiculo')(sequelize, require('sequelize').DataTypes);


Obra.hasMany(AsignacionObra, { foreignKey: 'id_obra' });
Vehiculo.hasMany(AsignacionObra, { foreignKey: 'id_vehiculo' });

AsignacionObra.belongsTo(Obra, { foreignKey: 'id_obra' });

AsignacionObra.belongsTo(Vehiculo, { foreignKey: 'id_vehiculo' });


const uploadDocumentoFinalizacion = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Debe subir un archivo en formato PDF' });
        }

        const { id } = req.params;
        const documentoFinalizacion = req.file.buffer;

        const asignacionObra = await AsignacionObra.findByPk(id);
        if (!asignacionObra) {
            return res.status(404).json({ error: 'Asignación de obra no encontrada' });
        }

        // Actualizar la asignación con el documento
        await asignacionObra.update({ 
            documento_finalizacion: documentoFinalizacion,
            estado: 'obra finalizada', 
            fecha_finalizacion: new Date(),
        });

        res.status(200).json({ message: 'Documento de finalización cargado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error al cargar el documento de finalización' });
    }
};

const asignarVehiculoAObra = async (req, res) => {
    try {
      const { id_obra, id_vehiculo } = req.body;
  
      const nuevaAsignacion = await AsignacionObra.create({
        id_obra,
        id_vehiculo,
        fecha_asignacion: new Date(),
        estado_obra: 'En tránsito',
      });
  
      res.status(201).json({ message: 'Asignación creada exitosamente', nuevaAsignacion });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la asignación' });
    }
  };
  
const cambiarEstadoAsignacion = async (req, res) => {
    try {
      const { id } = req.params;
      const { nuevo_estado } = req.body;
  
      const asignacion = await AsignacionObra.findByPk(id);
      if (!asignacion) return res.status(404).json({ error: 'Asignación no encontrada' });
  
      await asignacion.update({ estado_obra: nuevo_estado });
      res.status(200).json({ message: 'Estado de la asignación actualizado', asignacion });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado de la asignación' });
    }
  };


  const getAsignaciones = async (req, res) => {
    try {
      let asignaciones = await AsignacionObra.findAll({
        include: [Obra, Vehiculo],
        // include documento_finalizacion only if the user is a coordinadora
        attributes: req.user.rol === 'Coordinadora' ? null : { exclude: ['documento_finalizacion'] },
      });
      if (req.user.rol === 'Conductor') {
        asignaciones = asignaciones.filter(asignacion => asignacion.vehiculo.id_usuario === req.user.id);
      }
      res.json(asignaciones);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener las asignaciones' });
    }
  }
  

module.exports = { uploadDocumentoFinalizacion, asignarVehiculoAObra, cambiarEstadoAsignacion, getAsignaciones };
