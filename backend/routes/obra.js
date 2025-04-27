// routes/obra.js
const express = require('express');
const { createObra, getObras, getObraById, updateObra, deleteObra, getHistorialObra } = require('../controllers/obraController');
const verifyRole = require('../middlewares/roleMiddleware');
const router = express.Router();

// Solo usuarios con rol 'Coordinadora' pueden crear, actualizar y eliminar obras
router.post('/', verifyRole(['Coordinadora']), createObra);
router.get('/', verifyRole(['Coordinadora', 'Conductor']), getObras);
router.get('/:id', verifyRole(['Coordinadora', 'Conductor']), getObraById);
router.delete('/:id', verifyRole(['Coordinadora']), deleteObra);
router.get('/historial/:id', verifyRole(['Coordinadora']), getHistorialObra);
router.put('/:id', verifyRole(['Coordinadora']), updateObra);

module.exports = router;
