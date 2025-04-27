// middlewares/auth.js
const { sequelize } = require('../config/database/Connection');
const Usuario = require('../models/Usuario')(sequelize, require('sequelize').DataTypes);
const jwt = require('jsonwebtoken');
const Rol = require('../models/Rol')(sequelize, require('sequelize').DataTypes);
require('dotenv').config();

Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authorization || req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        const usuario = await Usuario.findByPk(decoded.id, {
            include: Rol
        });
        req.user = {
            id: usuario.id_usuario,
            rol: usuario.rol.nombre_rol,
            nombre: usuario.nombre_usuario,
            email: usuario.email,
        };
        next();
    });
};

module.exports = authenticateToken;
