const { Router } = require('express');
const Producto = require('../models/Producto');
const { verifyToken, isAdmin } = require('../middlewares/auth');


const router = Router();


// Listado público (podés protegerlo si querés)
router.get('/', async (req, res) => {
const items = await Producto.findAll({ order: [['id', 'ASC']] });
res.json(items);
});


router.get('/:id', async (req, res) => {
const item = await Producto.findByPk(req.params.id);
if (!item) return res.status(404).json({ message: 'No encontrado' });
res.json(item);
});


// Crear/editar/borrar: solo admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
const { nombre, precio } = req.body;
const item = await Producto.create({ nombre, precio });
res.status(201).json(item);
});


router.put('/:id', verifyToken, isAdmin, async (req, res) => {
const { nombre, precio } = req.body;
const item = await Producto.findByPk(req.params.id);
if (!item) return res.status(404).json({ message: 'No encontrado' });
item.nombre = nombre;
item.precio = precio;
item.actualizado_en = new Date();
await item.save();
res.json(item);
});


router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
const ok = await Producto.destroy({ where: { id: req.params.id } });
if (!ok) return res.status(404).json({ message: 'No encontrado' });
res.status(204).end();
});


module.exports = router;