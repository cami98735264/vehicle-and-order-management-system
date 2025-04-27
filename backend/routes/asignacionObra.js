// routes/asignacionObra.js
const express = require('express');
const { uploadDocumentoFinalizacion, asignarVehiculoAObra, cambiarEstadoAsignacion,getAsignaciones } = require('../controllers/asignacionObraController');
const verifyRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/fileUpload');
const router = express.Router();

// Ruta para cargar documento de finalización (solo para conductores)
router.get('/', verifyRole(['Coordinadora', 'Conductor']), getAsignaciones);
router.put('/:id/upload', verifyRole(['Conductor', 'Coordinadora']), upload.single('documento'), uploadDocumentoFinalizacion);
router.post('/', verifyRole(['Coordinadora']), asignarVehiculoAObra);
router.put('/:id/estado', verifyRole(['Conductor', 'Coordinadora']), cambiarEstadoAsignacion);


module.exports = router;
