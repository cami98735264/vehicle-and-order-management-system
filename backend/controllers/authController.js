// controllers/authController.js
const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database/Connection.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const Usuario = require('../models/Usuario')(sequelize, Sequelize.DataTypes);
const Rol = require('../models/Rol')(sequelize, Sequelize.DataTypes);

Rol.hasMany(Usuario, { foreignKey: 'id_rol', sourceKey: "id_rol" });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', targetKey: "id_rol" });

require('dotenv').config();

const generateToken = (usuario) => {
    return jwt.sign({ id: usuario.id_usuario, rol: usuario.rol.nombre_rol, nombre: usuario.nombre_usuario, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const setAuthCookie = (res, token) => {
    res.cookie('authorization', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // En producción, utiliza cookies seguras
        sameSite: 'strict',
        maxAge: 3600000, // 1 hora en milisegundos
    });
};


const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email }, include: Rol });
        if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar el token y establecer la cookie
        console.log(usuario.toJSON());
        const token = generateToken(usuario);
        setAuthCookie(res, token);

        res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};



const logout = (req, res) => {
    res.clearCookie('authorization').json({ message: 'Sesión cerrada' });
    res.status(200).json({ message: 'Sesión cerrada', success: true });
};


const checkAuth = (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            user: req.user,
            message: 'Usuario autenticado',
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Usuario no autenticado',
        });
    }
};


module.exports = { login, logout, checkAuth };