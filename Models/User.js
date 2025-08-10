const mongoose = require('mongoose');

// Esquema del perfil
const perfilSchema = new mongoose.Schema({
  biografia: { type: String, default: "" },
  foto_perfil: { type: String, default: "" },  // URL de la foto
});

// Esquema del usuario
const UserSchema = new mongoose.Schema({
  apodo: { type: String, default: 'Usuario Nuevo' },
  nombre: { type: String },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  admin: { type: Boolean, default: false },  // Puede ser un valor booleano
  fecha_registro: { type: Date, default: Date.now },
  perfil: perfilSchema,
  preguntas_publicadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pregunta' }],
  respuestas_dadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Respuesta' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
