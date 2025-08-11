const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha_publicacion: { type: Date },
  respuestas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],
  modified: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  mensaje_admin: { type: String }
});

module.exports = mongoose.model('Post', PostSchema);