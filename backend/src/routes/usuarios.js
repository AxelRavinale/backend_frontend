const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { verifyToken, isAdmin } = require('../middlewares/auth');


const router = Router();


// Listar usuarios (privado: cualquier logueado)
router.get('/', verifyToken, async (req, res) => {
const users = await Usuario.findAll({ attributes: ['id', 'nombre', 'email', 'rol', 'creado_en'], order: [['id','ASC']] });
res.json(users);
});


// Cambiar rol (solo admin)
router.put('/:id/rol', verifyToken, isAdmin, async (req, res) => {
const { id } = req.params;
const { rol } = req.body; // 'admin' | 'moderador' | 'cliente'
const user = await Usuario.findByPk(id);
if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
user.rol = rol;
await user.save();
res.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
});


module.exports = router;