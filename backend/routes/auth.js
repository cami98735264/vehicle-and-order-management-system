// routes/auth.js
const express = require('express');
const { login, checkAuth, logout } = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/check', authenticateToken, checkAuth); // Nueva ruta para verificar autenticación
module.exports = router;
