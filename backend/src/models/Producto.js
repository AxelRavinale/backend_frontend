const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Producto = sequelize.define('Producto', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
nombre: { type: DataTypes.STRING(120), allowNull: false },
precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
actualizado_en: { type: DataTypes.DATE, allowNull: true },
}, {
tableName: 'productos',
timestamps: false,
});


module.exports = Producto;