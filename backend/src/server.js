require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/usuarios');
const productRoutes = require('./routes/productos');


const app = express();


app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/productos', productRoutes);


// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));


// Error handler
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ message: err.message || 'Error' });
});


const PORT = process.env.PORT || 3001;


(async () => {
try {
await sequelize.authenticate();
console.log('✅ Conectado a MySQL');
await sequelize.sync({ alter: true });
console.log('✅ Tablas sincronizadas');
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
} catch (e) {
console.error('❌ Error al iniciar:', e);
process.exit(1);
}
})();