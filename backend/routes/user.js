// routes/user.js
const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const verifyRole = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', verifyRole(['Administrador']), createUser);
router.get('/', verifyRole(['Administrador', 'Coordinadora']), getUsers);
router.get('/:id', verifyRole(['Administrador']), getUserById);
router.put('/:id', verifyRole(['Administrador']), updateUser);
router.delete('/:id', verifyRole(['Administrador']), deleteUser);

module.exports = router;
