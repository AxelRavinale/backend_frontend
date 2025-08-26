const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');


const router = Router();


router.post('/registro', async (req, res) => {
try {
const { nombre, email, password } = req.body;
const existing = await Usuario.findOne({ where: { email } });
if (existing) return res.status(409).json({ message: 'Email ya registrado' });


const hash = await bcrypt.hash(password, 10);
const user = await Usuario.create({ nombre, email, password_hash: hash });
const payload = { id: user.id, email: user.email, rol: user.rol };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
res.json({ token, user: payload });
} catch (e) {
res.status(500).json({ message: e.message });
}
});


router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const user = await Usuario.findOne({ where: { email } });
if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });


const ok = await bcrypt.compare(password, user.password_hash);
if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });


const payload = { id: user.id, email: user.email, rol: user.rol };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
res.json({ token, user: payload });
} catch (e) {
res.status(500).json({ message: e.message });
}
});


module.exports = router;