const jwt = require('jsonwebtoken');


function verifyToken(req, res, next) {
const auth = req.headers.authorization || '';
const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
if (!token) return res.status(401).json({ message: 'No autenticado' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { id, email, rol }
next();
} catch (e) {
return res.status(401).json({ message: 'Token inválido o expirado' });
}
}


function isAdmin(req, res, next) {
if (req.user?.rol !== 'admin') return res.status(403).json({ message: 'Requiere rol admin' });
next();
}


module.exports = { verifyToken, isAdmin };