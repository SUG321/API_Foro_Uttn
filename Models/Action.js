const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action_type: { type: Number, required: true },
  details: { type: String },
  action_date: { type: Date },
  objective_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'objective_type' },
  objective_type: { type: String, enum: ['User', 'Post', 'Response', 'Faq'] } // vinculado a tus modelos
});


module.exports = mongoose.model('Action', ActionSchema, 'actions');
