const mongoose = require('mongoose');

const votosSchema = new mongoose.Schema({
  me_gusta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  no_me_gusta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  pregunta_id: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
  contenido: { type: String, required: true },
  fecha_respuesta: { type: Date, default: Date.now },
  votos: { type: votosSchema, default: () => ({ me_gusta: [], no_me_gusta: [] }) }
});

module.exports = mongoose.model('Response', ResponseSchema, 'responses');