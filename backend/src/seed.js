require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');


(async () => {
try {
await sequelize.authenticate();
await sequelize.sync({ alter: true });


const pass = await bcrypt.hash('admin123', 10);
const [admin] = await Usuario.findOrCreate({
where: { email: 'admin@demo.com' },
defaults: { nombre: 'Admin', email: 'admin@demo.com', password_hash: pass, rol: 'admin' }
});


await Producto.findOrCreate({ where: { nombre: 'Proteína Whey' }, defaults: { precio: 4500.5 } });
await Producto.findOrCreate({ where: { nombre: 'Creatina 300g' }, defaults: { precio: 3200 } });


console.log('✅ Seed OK:', admin.email);
} catch (e) {
console.error(e);
} finally {
await sequelize.close();
}
})();