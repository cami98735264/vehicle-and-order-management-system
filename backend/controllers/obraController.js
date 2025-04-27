// controllers/obraController.js
const { sequelize } = require('../config/database/Connection');
const Obra = require('../models/Obra')(sequelize, require('sequelize').DataTypes);


const createObra = async (req, res) => {
    try {
        const obra = await Obra.create(req.body);
        res.status(201).json(obra);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la obra' });
    }
};

const getObras = async (req, res) => {
    try {
        const obras = await Obra.findAll();
        res.json(obras);
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: 'Error al obtener las obras' });
    }
};

const getObraById = async (req, res) => {
    try {
        const obra = await Obra.findByPk(req.params.id);
        if (!obra) return res.status(404).json({ error: 'Obra no encontrada' });
        res.json(obra);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la obra' });
    }
};

const updateObra = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_obra, direccion, asesor_nombre, asesor_contacto, historial, prioridad } = req.body;
  
      const obra = await Obra.findByPk(id);
      if (!obra) return res.status(404).json({ error: 'Obra no encontrada' });
  
      await obra.update({ nombre_obra, direccion, asesor_nombre, asesor_contacto, historial, prioridad });
      res.status(200).json({ message: 'Obra actualizada exitosamente', obra });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la obra' });
    }
  };
  
const deleteObra = async (req, res) => {
    try {
        const obra = await Obra.findByPk(req.params.id);
        if (!obra) return res.status(404).json({ error: 'Obra no encontrada' });

        await obra.destroy();
        res.json({ message: 'Obra eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la obra' });
    }
};

const getHistorialObra = async (req, res) => {
    try {
      const { id } = req.params;
      const historial = await Obra.findByPk(id, {
        attributes: ['historial'],
      });
  
      if (!historial) {
        return res.status(404).json({ error: 'Obra no encontrada' });
      }
  
      res.status(200).json(historial.historial || []);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial de la obra' });
    }
  };
  
  

module.exports = { createObra, getObras, getObraById, updateObra, deleteObra, getHistorialObra };
