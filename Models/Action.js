const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  accion: { type: String, required: true },
  detalles: { type: String },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Action', ActionSchema, 'actions');