// middlewares/authValidator.js
const { body } = require('express-validator');

const registerValidation = [
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('id_rol').isInt().withMessage('Debe proporcionar un rol válido')
];

const loginValidation = [
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

module.exports = { registerValidation, loginValidation };
