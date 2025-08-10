const mongoose = require('mongoose');

const votosSchema = new mongoose.Schema({
  me_gusta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  no_me_gusta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: false });

const PostSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  apodo: { type: String},
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
  fecha_publicacion: { type: Date },
  respuestas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'responeses' }],
  votos: { type: votosSchema, default: () => ({ me_gusta: [], no_me_gusta: [] }) },
  modified: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  mensaje_admin: { type: String }
});

module.exports = mongoose.model('Post', PostSchema);