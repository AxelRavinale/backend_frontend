const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Usuario = sequelize.define('Usuario', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
nombre: { type: DataTypes.STRING(80), allowNull: false },
email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
password_hash: { type: DataTypes.TEXT, allowNull: false },
rol: {
type: DataTypes.ENUM('admin', 'moderador', 'cliente'),
allowNull: false,
defaultValue: 'cliente',
},
creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
tableName: 'usuarios',
timestamps: false,
});


module.exports = Usuario;