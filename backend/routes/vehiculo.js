// routes/vehiculo.js
const express = require('express');
const { createVehiculo, getVehiculos, getVehiculoById, updateVehiculo, deleteVehiculo, getHistorialVehiculo, actualizarEstadoVehiculo } = require('../controllers/vehiculoController');
const verifyRole = require('../middlewares/roleMiddleware');
const router = express.Router();

// Solo usuarios con rol 'Coordinadora' pueden crear, actualizar y eliminar vehículos
router.post('/', verifyRole(['Coordinadora']), createVehiculo);
router.get('/', verifyRole(['Coordinadora', 'Conductor']), getVehiculos);
router.get('/:id', verifyRole(['Coordinadora', 'Conductor']), getVehiculoById);
router.put('/:id', verifyRole(['Coordinadora', 'Conductor']), updateVehiculo);
router.delete('/:id', verifyRole(['Coordinadora']), deleteVehiculo);
router.put('/estado', verifyRole(['Conductor']), actualizarEstadoVehiculo);
router.get('/historial/:id', verifyRole(['Coordinadora', 'Conductor']), getHistorialVehiculo);


module.exports = router;
