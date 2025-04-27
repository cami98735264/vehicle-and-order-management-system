// middlewares/roleMiddleware.js
const { sequelize } = require('../config/database/Connection');
const Usuario = require('../models/Usuario')(sequelize, require('sequelize').DataTypes); 
const Rol = require('../models/Rol')(sequelize, require('sequelize').DataTypes);

const jwt = require('jsonwebtoken');
require('dotenv').config();

Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.cookies.authorization || req.headers['authorization'];
        if (!token) return res.status(403).json({ error: 'No token provided' });

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Invalid token' });

            const usuario = await Usuario.findByPk(decoded.id, {
                include: Rol
            });

            const userRole = usuario.rol.nombre_rol;
            
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            req.user = decoded;
            next();
        });
    };
};

module.exports = verifyRole;
