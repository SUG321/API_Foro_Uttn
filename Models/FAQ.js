const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faq', FAQSchema, 'faqs');