// controllers/userController.js
const { sequelize } = require('../config/database/Connection');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario')(sequelize, require('sequelize').DataTypes);
const Rol = require('../models/Rol')(sequelize, require('sequelize').DataTypes);


Rol.hasMany(Usuario, { foreignKey: 'id_rol' });

Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

// Crear usuario
const createUser = async (req, res) => {
    const { nombre_usuario, email, password, id_rol } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({
            nombre_usuario,
            email,
            password_hash: hashedPassword,
            id_rol
        });
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ include: Rol,
            where: req.user.rol === "Coordinadora" ? { id_rol: 2 } : { id_rol: [1, 2] },
            attributes: { exclude: ['password_hash'] }
         });
         console.log(req.user);
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, { include: Rol });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, email, id_rol } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        await usuario.update({ nombre_usuario, email, id_rol });
        res.json({ message: 'Usuario actualizado exitosamente', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        await usuario.destroy();
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
